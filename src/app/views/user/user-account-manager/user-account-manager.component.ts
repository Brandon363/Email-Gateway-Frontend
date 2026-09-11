import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModules } from '../../shared/shared_modules';
import { UserDTO } from '../../../models/user.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { VerificationStatus } from '../../../models/enum.interface';
import { ExtractedUserDTO } from '../../../models/extracted_user.interface';
import { DocumentService } from '../../../services/document.service';
import moment from 'moment';
import { NotificationService } from '../../../services/notification.service';
import { VerificationTrackingComponent } from "../verification-tracking/verification-tracking.component";

@Component({
  selector: 'app-user-account-manager',
  imports: [SharedModules, VerificationTrackingComponent],
  templateUrl: './user-account-manager.component.html',
  styleUrl: './user-account-manager.component.scss'
})
export class UserAccountManagerComponent implements OnInit, OnDestroy {

  user!: UserDTO;
  extractedUser!: ExtractedUserDTO;

  userSubscription!: Subscription;
  viewDocumentSubscription!: Subscription;
  pdfUrl: any = null;


  verificationStatus = VerificationStatus;

  breadcomb_menu_items = [
    {
      label: 'Home',
      routerLink: '/client-dashboard'
    },
    { label: 'My Account' }
  ];
  home = { icon: 'pi pi-home', routerLink: '/client-dashboard' };

  constructor(
    private messageService: MessageService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private documentService: DocumentService,
    private notificationService: NotificationService,

  ) { }


  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.viewDocumentSubscription?.unsubscribe();
  }


  ngOnInit(): void {
    this.loadingService.setLoadingState(true);
    this.user = this.authService.getCurrentUser();
    this.userSubscription = this.userService.getByUserId(this.user.id).subscribe((user) => {
      this.loadingService.setLoadingState(false);
      if (user.success && user.user) {
        this.user = user.user;
        if (user.user.extracted_users && user.user.extracted_users.length > 0) {
          this.extractedUser = user.user.extracted_users![user.user.extracted_users!.length - 1];
          if (this.extractedUser) {
            this.viewDocument(this.user.id);
          }
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not retrieve user data' });
      }
    });
  }

  viewDocument(user_id: number): void {
    this.loadingService.setLoadingState(true);
    this.viewDocumentSubscription = this.documentService.viewIdDocumentFileByUserId(user_id).subscribe({
      next: pdfUrl => {
        this.loadingService.setLoadingState(false);
        this.pdfUrl = pdfUrl;
      },
      error: error => {
        this.loadingService.setLoadingState(false);
        console.error(error);
      }
    });
  }

  convertDateToLocal(dateString: Date | undefined): string {
    if (!dateString) {
      return '';
    }
    return moment.utc(dateString).local().format('LLLL');
  }

  navigateToEdit(): void {
    this.router.navigate([`/edit-user/${this.user.id}`]);
  }

  resubmitForVerification(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to resubmit your documents for verification?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonProps: {
        label: 'Submit',
        severity: 'primary',
      },
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.loadingService.setLoadingState(true);
        // const verificationRequest: UserVerifificationRequest = {
        //   user_id: this.user.id,
        //   verification_notes: null,
        // }
        this.userService.resubmitVerification(this.user.id).subscribe((response) => {
          this.loadingService.setLoadingState(false);
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'Resubmission Successful', detail: `Your documents have been resubmitted for verification.` });
            if (response.notification) {
              this.notificationService.updateUserNotificationData(response.notification);
            }
            this.ngOnInit();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        });
      },
      reject: () => {
      }
    });
  }


}
