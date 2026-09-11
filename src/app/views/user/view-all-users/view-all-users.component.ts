import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModules } from '../../shared/shared_modules';
import { Subscription } from 'rxjs';
import { UserDTO } from '../../../models/user.interface';
import { UserService } from '../../../services/user.service';
import { LoadingService } from '../../../services/loading.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { VerificationStatus } from '../../../models/enum.interface';

@Component({
  selector: 'app-view-all-users',
  imports: [SharedModules],
  templateUrl: './view-all-users.component.html',
  styleUrl: './view-all-users.component.scss'
})
export class ViewAllUsersComponent implements OnInit, OnDestroy {

  getAllSubscription!: Subscription;
  retrieveSubscription!: Subscription;
  editSubscription!: Subscription;
  deleteSubscription!: Subscription;
  loadingSubscription!: Subscription;
  downloadEmptyBufferLevelsSubscription!: Subscription;
  downloadTemplateSubscription!: Subscription;
  syncSubscription!: Subscription;


  sortOrder!: number;
  sortField!: string;
  tenderStatusSelectedValue: any;


  sortOptions!: SelectItem[];
  sortKey: string | null = null;


  verificationStatus = VerificationStatus;

  allUsers: UserDTO[] = [];
  filteredUsers: UserDTO[] = [];

  statusSelected: string = '';
  selectedProductBufferLevel: UserDTO | undefined;


  showAddConfigDialog: boolean = false;
  showEditProductBufferLevelDialog: boolean = false;

  greenColor: string = 'rgb(7, 170, 7)';
  redColor: string = 'rgb(170, 7, 7)';

  reviewStatuses = [
    { label: 'Pending Review', value: null },
    { label: 'Confirmed Fraud', value: 1 },
    { label: 'Dismissed', value: 0 }
  ];

  layoutView: 'table' | 'card' = 'table';
  layoutOptions = [
    { icon: 'pi pi-table', value: 'table', label: 'Table' },
    { icon: 'pi pi-th-large', value: 'card', label: 'Cards' }
  ];

  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService) { }

  cards: any[] = [];
  loading = true;
  uploadedFiles: any[] = [];


  ngOnDestroy(): void {
    this.getAllSubscription?.unsubscribe();
    this.retrieveSubscription?.unsubscribe();
    this.editSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
    this.loadingSubscription?.unsubscribe();
    this.downloadEmptyBufferLevelsSubscription?.unsubscribe();
    this.downloadTemplateSubscription?.unsubscribe();
    this.syncSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.layoutView = 'card';
    }
    this.getAllTestConfigs();
  }

  addTestConfig() {
    this.showAddConfigDialog = true;
  }

  getAllTestConfigs() {
    this.loadingService.setLoadingState(true);
    this.loading = true;
    this.getAllSubscription = this.userService.getAllActiveUsers().subscribe()
    this.retrieveSubscription = this.userService.retrieveUserData().subscribe((response) => {
      console.log(response);
      this.allUsers = response;
      this.allUsers = response.sort((a, b) => {
        const dateA = a.date_updated ? new Date(a.date_updated).getTime() : 0;
        const dateB = b.date_updated ? new Date(b.date_updated).getTime() : 0;
        return dateB - dateA;
      });
      this.filteredUsers = [...this.allUsers];

      this.updateCardNumbers(null);
      this.loadingService.setLoadingState(false);
      this.loading = false;
    })
  }


  onSortChange(event: any) {
    if (event) {
      let value = event.value;

      if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
      } else {
        this.sortOrder = 1;
        this.sortField = value;
      }
    }
  }


  searchTenders(query: string): void {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      this.filteredUsers = [...this.allUsers];
      this.updateCardNumbers(null)
      return;
    }

    this.filteredUsers = this.allUsers.filter(user => {
      // console.log(tender)
      return [
        user.first_name,
        user.last_name,
        user.id_number,
      ].some(field => field?.toLowerCase().includes(trimmedQuery));
    });
    this.updateCardNumbers(null)

  }

  isPublishedToday(publishDate: Date | undefined): boolean {
    const today = new Date();
    if (!publishDate) {
      return false;
    }
    const publishDateDate = new Date(publishDate);
    return (
      publishDateDate.getDate() === today.getDate() &&
      publishDateDate.getMonth() === today.getMonth() &&
      publishDateDate.getFullYear() === today.getFullYear()
    );
  }

  onDeleteProductBufferLevel(productBufferLevel: UserDTO) {
    if (productBufferLevel.id) {
      this.loadingService.setLoadingState(true);
      this.deleteSubscription = this.userService.deleteUserById(productBufferLevel.id).subscribe((response) => {
        this.loadingService.setLoadingState(false);
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `${response.message}` });
          this.getAllTestConfigs();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: `${response.message}` })
        }
      })
    }

  }


  confirmDelete(event: Event, productBufferLevel: UserDTO) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this client?',
      header: 'Delete Client',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.onDeleteProductBufferLevel(productBufferLevel);
      },
      reject: () => {
      },
    });
  }


  clear(table: Table) {
    table.clear();
  }


  getStatusSeverityAndWord(status: VerificationStatus) {
    switch (status) {
      case status = VerificationStatus.REJECTED:
        return { severity: 'danger' as const, status: 'Rejected' };

      case status = VerificationStatus.UNVERIFIED:
        return { severity: 'warn' as const, status: 'Unverified' };

      case status = VerificationStatus.PENDING:
        return { severity: 'secondary' as const, status: 'Pending' };

      case status = VerificationStatus.VERIFIED:
        return { severity: 'success' as const, status: 'Verified' };

      default:
        return { severity: 'info' as const, status: 'Unknown' };
    }
  }


  updateCardNumbers(dt: any) {
    this.cards = [
      {
        title: "Total Clients",
        value: this.allUsers.length.toString(),
        description: "Active clients in the system",
        icon: "pi pi-users"
      },
      {
        title: "Verified Clients",
        value: this.allUsers.filter(c => c.verification_status === VerificationStatus.VERIFIED).length.toString(),
        description: "Verified clients in the system",
        icon: "pi pi-verified"
      },
      {
        title: "Pending Verification",
        value: this.allUsers.filter(c => c.verification_status === VerificationStatus.PENDING).length.toString(),
        description: "Unverified clients in the system",
        icon: "pi pi-clock"
      },
      {
        title: "Unverified Clients",
        value: this.allUsers.filter(c => c.verification_status === VerificationStatus.UNVERIFIED).length.toString(),
        description: "Unverified clients in the system",
        icon: "pi pi-times-circle"
      }
    ]
  }


  viewUserDetails(user: UserDTO) {
    this.router.navigate(['/user/', user.id]);
  }

}
