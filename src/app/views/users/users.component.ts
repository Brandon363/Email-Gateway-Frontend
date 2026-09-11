import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SharedModules } from '../shared/shared_modules';
import { AuthService } from '../../services/auth.service';
import { UserCreateRequest, UserDTO } from '../../models/user.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SharedModules],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  users: UserDTO[] = [];
  filteredUsers: UserDTO[] = [];
  loading: boolean = false;
  submitting: boolean = false;
  deleting: boolean = false;

  searchQuery: string = '';
  showCreateDialog: boolean = false;
  showDeleteDialog: boolean = false;
  userToDelete: UserDTO | null = null;
  currentUserId: number | null = null;

  createUserForm!: FormGroup;

  roleOptions = [
    { label: 'Administrator', value: 'ADMIN' },
    { label: 'Operator', value: 'OPERATOR' }
  ];

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.currentUserId = currentUser.id;
    }

    this.initForm();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initForm(): void {
    this.createUserForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      user_role: new FormControl('ADMIN', [Validators.required])
    });
  }

  loadUsers(): void {
    this.loading = true;
    const sub = this.authService.getAllActiveUsers().subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response && response.users) {
          this.users = response.users;
        } else if (Array.isArray(response)) {
          this.users = response;
        } else {
          this.users = [];
        }
        this.filterUsers();
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.detail || err?.message || 'Failed to load users.'
        });
      }
    });
    this.subscriptions.add(sub);
  }

  filterUsers(): void {
    const query = this.searchQuery?.trim()?.toLowerCase() || '';
    if (!query) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(u =>
      (u.first_name && u.first_name.toLowerCase().includes(query)) ||
      (u.last_name && u.last_name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.user_role && u.user_role.toLowerCase().includes(query))
    );
  }

  openCreateDialog(): void {
    this.createUserForm.reset({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      user_role: 'ADMIN'
    });
    this.showCreateDialog = true;
  }

  onCreateUser(): void {
    if (this.createUserForm.invalid) {
      return;
    }

    this.submitting = true;
    const formVal = this.createUserForm.value;
    const createReq: UserCreateRequest = {
      first_name: formVal.first_name.trim(),
      last_name: formVal.last_name.trim(),
      email: formVal.email.trim().toLowerCase(),
      password: formVal.password,
      user_role: formVal.user_role
    };

    const sub = this.authService.register(createReq).subscribe({
      next: (response) => {
        this.submitting = false;
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'User Created',
            detail: `User ${createReq.email} was created successfully.`
          });
          this.showCreateDialog = false;
          this.loadUsers();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Creation Failed',
            detail: response.message || 'Failed to create user.'
          });
        }
      },
      error: (err) => {
        this.submitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.detail || err?.message || 'Failed to create user.'
        });
      }
    });
    this.subscriptions.add(sub);
  }

  confirmDelete(user: UserDTO): void {
    if (user.email?.toLowerCase() === 'brandon.mutombwa@dataalafrica.com') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Action Denied',
        detail: 'The primary administrator account cannot be deleted.'
      });
      return;
    }

    if (user.id === this.currentUserId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Action Denied',
        detail: 'You cannot delete your own active logged-in account.'
      });
      return;
    }

    this.userToDelete = user;
    this.showDeleteDialog = true;
  }

  executeDelete(): void {
    if (!this.userToDelete || !this.userToDelete.id) {
      return;
    }

    this.deleting = true;
    const sub = this.authService.deleteUser(this.userToDelete.id).subscribe({
      next: (response) => {
        this.deleting = false;
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'User Removed',
            detail: `${this.userToDelete?.email} has been removed.`
          });
          this.showDeleteDialog = false;
          this.userToDelete = null;
          this.loadUsers();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Delete Failed',
            detail: response.message || 'Could not delete user.'
          });
        }
      },
      error: (err) => {
        this.deleting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.detail || err?.message || 'Failed to delete user.'
        });
      }
    });
    this.subscriptions.add(sub);
  }

  getInitials(user: UserDTO): string {
    const f = user.first_name ? user.first_name.charAt(0) : '';
    const l = user.last_name ? user.last_name.charAt(0) : '';
    return (f + l).toUpperCase() || 'U';
  }

  copyToClipboard(text: string, label: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Copied',
        detail: `${label} copied to clipboard.`
      });
    });
  }
}
