import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { SharedModules } from '../../views/shared/shared_modules';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import { AppComponent } from '../../app.component';
import { NotificationDTO } from '../../models/notification.interface';
import '@dotlottie/player-component';

@Component({
  selector: 'app-navbar',
  imports: [RouterOutlet, SharedModules],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isSidebarCollapsed: boolean = false;

  items: MenuItem[] | undefined;
  isManipulatingData: boolean = false;
  loadingSubscription!: Subscription;
  themeIcon: string = 'pi pi-moon';
  username: string = "Admin";
  avatarText: string = "GA";

  notificationSubscription!: Subscription;
  logoutSubscription!: Subscription;

  allActiveNotifications: NotificationDTO[] = [];
  allActiveUnreadNotifications: NotificationDTO[] = [];

  showMobileMenu: boolean = false;

  showEnforcedPasswordChangeDialog: boolean = false;
  currentPasswordInput: string = '';
  newPasswordInput: string = '';
  confirmPasswordInput: string = '';
  changingPasswordLoading: boolean = false;

  currentLoadingMessage: string = '';
  private messageInterval: any;
  private messageIndex: number = 0;
  private loadingMessages: string[] = [
    "Syncing email routes...",
    "Validating webhook endpoints...",
    "Connecting to Inbound Service...",
    "Listening for incoming mail...",
    "Checking webhook logs..."
  ];

  accountMenuItems: MenuItem[] = [
    {
      label: 'Account',
      icon: 'pi pi-fw pi-user',
      routerLink: '/account'
    },
    {
      label: "Toggle Theme",
      icon: 'pi pi-fw pi-palette',
      command: () => this.toggleDarkMode()
    },
    {
      label: 'Logout',
      icon: 'pi pi-fw pi-sign-out',
      command: () => this.onLogout()
    }
  ];

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private messageService: MessageService,
    private sharedService: SharedService,
    private app: AppComponent
  ) { }

  ngOnInit() {
    const savedState = localStorage.getItem('sidebar_collapsed');
    if (savedState !== null) {
      this.isSidebarCollapsed = savedState === 'true';
    }

    try {
      const user = this.authService.getCurrentUser();
      if (user && user.email) {
        const firstName = user.first_name || 'Gateway';
        const lastName = user.last_name || 'Admin';
        this.username = `${firstName} ${lastName}`;
        this.avatarText = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        if (user.must_change_password) {
          this.showEnforcedPasswordChangeDialog = true;
        }
      }
    } catch {
      this.avatarText = 'GA';
    }

    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: '/admin-dashboard',
      },
      {
        label: 'Email Routes',
        icon: 'pi pi-fw pi-directions',
        routerLink: '/routes',
      },
      {
        label: 'Inbound Logs',
        icon: 'pi pi-fw pi-inbox',
        routerLink: '/logs',
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-users',
        routerLink: '/users',
      },
      {
        label: 'Account & Settings',
        icon: 'pi pi-fw pi-user',
        routerLink: '/account',
      },
    ];

    this.loadingSubscription = this.loadingService.isManipulatingData$.subscribe((isLoading) => {
      Promise.resolve(null).then(() => {
        this.isManipulatingData = isLoading;
        if (isLoading) {
          this.startMessageRotation();
        } else {
          this.stopMessageRotation();
        }
      });
    });
  }

  private startMessageRotation() {
    this.clearLoadingInterval();
    this.messageIndex = Math.floor(Math.random() * this.loadingMessages.length);
    this.currentLoadingMessage = this.loadingMessages[this.messageIndex];

    this.messageInterval = setInterval(() => {
      this.messageIndex = (this.messageIndex + 1) % this.loadingMessages.length;
      this.currentLoadingMessage = this.loadingMessages[this.messageIndex];
    }, 3500);
  }

  private stopMessageRotation() {
    this.clearLoadingInterval();
  }

  private clearLoadingInterval() {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
      this.messageInterval = null;
    }
  }

  onLogout() {
    this.loadingService.setLoadingState(true);
    this.logoutSubscription = this.authService.logout().subscribe({
      next: (response) => {
        this.loadingService.setLoadingState(false);
        this.messageService.add({ severity: 'success', summary: 'Logged Out', detail: 'You have been logged out successfully.' });
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loadingService.setLoadingState(false);
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
    this.logoutSubscription?.unsubscribe();
    this.clearLoadingInterval();
  }

  toggleDarkMode() {
    this.app.darkMode.set(!this.app.darkMode());
    localStorage.setItem('darkMode', String(this.app.darkMode()));

    const element = document.querySelector('html');

    if (this.app.darkMode()) {
      element?.classList.add('dark-theme');
      this.themeIcon = 'pi pi-sun';
    } else {
      element?.classList.remove('dark-theme');
      this.themeIcon = 'pi pi-moon';
    }
  }

  isActiveMenu(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('sidebar_collapsed', String(this.isSidebarCollapsed));
  }

  submitEnforcedPasswordChange(): void {
    if (!this.currentPasswordInput) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Password', detail: 'Enter your current / temporary password.' });
      return;
    }
    if (!this.newPasswordInput || this.newPasswordInput.length < 6) {
      this.messageService.add({ severity: 'warn', summary: 'Weak Password', detail: 'New password must be at least 6 characters.' });
      return;
    }
    if (this.newPasswordInput !== this.confirmPasswordInput) {
      this.messageService.add({ severity: 'warn', summary: 'Mismatch', detail: 'New passwords do not match.' });
      return;
    }
    if (this.newPasswordInput === this.currentPasswordInput) {
      this.messageService.add({ severity: 'warn', summary: 'Same Password', detail: 'New password must be different from your temporary password.' });
      return;
    }

    this.changingPasswordLoading = true;
    this.authService.changePassword(this.currentPasswordInput, this.newPasswordInput).subscribe({
      next: (response) => {
        this.changingPasswordLoading = false;
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Password Updated',
            detail: 'Your password has been changed successfully. You can now access your dashboard.'
          });
          this.showEnforcedPasswordChangeDialog = false;
          this.currentPasswordInput = '';
          this.newPasswordInput = '';
          this.confirmPasswordInput = '';
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: response.message || 'Failed to update password.'
          });
        }
      },
      error: (err) => {
        this.changingPasswordLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.detail || err?.message || 'Could not update password.'
        });
      }
    });
  }
}