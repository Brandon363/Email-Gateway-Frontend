import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedModules } from '../shared/shared_modules';
import { AuthService } from '../../services/auth.service';
import { UserDTO } from '../../models/user.interface';
import { AppComponent } from '../../app.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [SharedModules],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent implements OnInit {
  user: UserDTO | null = null;
  webhookUrl: string = '';

  displayPasswordDialog: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  changingPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    public app: AppComponent
  ) {}

  ngOnInit(): void {
    this.webhookUrl = `${environment.baseUrl}/inbound`;
    try {
      this.user = this.authService.getCurrentUser();
    } catch {
      this.user = null;
    }
  }

  toggleTheme(): void {
    this.app.darkMode.set(!this.app.darkMode());
    localStorage.setItem('darkMode', String(this.app.darkMode()));

    const element = document.querySelector('html');
    if (this.app.darkMode()) {
      element?.classList.add('dark-theme');
    } else {
      element?.classList.remove('dark-theme');
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Theme Changed',
      detail: `Theme switched to ${this.app.darkMode() ? 'Dark' : 'Light'} mode.`
    });
  }

  copyWebhookUrl(): void {
    navigator.clipboard.writeText(this.webhookUrl);
    this.messageService.add({
      severity: 'success',
      summary: 'Copied',
      detail: 'Webhook URL copied to clipboard!'
    });
  }

  openChangePasswordDialog(): void {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.displayPasswordDialog = true;
  }

  submitChangePassword(): void {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all password fields.'
      });
      return;
    }

    if (this.newPassword.length < 6) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'New password must be at least 6 characters.'
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'New passwords do not match.'
      });
      return;
    }

    this.changingPassword = true;
    this.authService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: (res: any) => {
        this.changingPassword = false;
        if (res && res.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password changed successfully!'
          });
          this.displayPasswordDialog = false;
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res?.message || 'Failed to change password.'
          });
        }
      },
      error: (err) => {
        this.changingPassword = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || err.error?.detail || 'Failed to change password.'
        });
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Logged Out',
          detail: 'You have been logged out.'
        });
        this.router.navigate(['/login']);
      },
      error: () => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
