import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModules } from '../../shared/shared_modules';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingService } from '../../../services/loading.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { ExtractedUserService } from '../../../services/extracted-user.service';
import { UserDTO } from '../../../models/user.interface';
import { AuthService } from '../../../services/auth.service';
import { PrimeNG } from 'primeng/config';
import { VerificationStatus } from '../../../models/enum.interface';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-user-verification-application',
  imports: [SharedModules],
  templateUrl: './user-verification-application.component.html',
  styleUrl: './user-verification-application.component.scss'
})
export class UserVerificationApplicationComponent implements OnInit, OnDestroy {

  verifySubscription!: Subscription;
  user!: UserDTO;

  breadcomb_menu_items = [
    {
      label: 'Home',
      routerLink: '/home-dashboard'
    },
    { label: 'Verify Account' }
  ];
  home = { icon: 'pi pi-home', routerLink: '/client-dashboard' };
  loading = false;

  constructor(
    private messageService: MessageService,
    public loadingService: LoadingService,
    public extractedUserService: ExtractedUserService,
    public authService: AuthService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private notificationService: NotificationService) { }

  ngOnDestroy(): void {
    this.verifySubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    if (this.user.verification_status === VerificationStatus.PENDING) {
      this.messageService.add({ severity: 'warn', summary: 'Verification Pending', detail: `You have already submitted verification` })
      this.router.navigate(['/client-dashboard']);
    }

    if (this.user.verification_status === VerificationStatus.VERIFIED) {
      this.messageService.add({ severity: 'info', summary: 'Verified', detail: `Your account is already verified` });
      this.router.navigate(['/client-dashboard']);
    }

    this.loadingService.isManipulatingData$.subscribe((loading) => {
      this.loading = loading;
    });
  }
  uploadedFiles: any[] = [];

  onUpload(event: FileUploadHandlerEvent) {
    this.uploadedFiles = [];
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  onClearUploads() {
    this.uploadedFiles = [];
    this.messageService.add({ severity: 'info', summary: 'File Cleared', detail: `All files cleared.` });
  }

  submitVerification() {
    this.loadingService.setLoadingState(true)
    const formData = new FormData();
    const file = this.uploadedFiles[0];
    formData.append('image_files', file, file.name);
    // formData.append('user_id', this.user.id.toString());

    const createRequest: { image_file: File; user_id: number } = {
      image_file: file,
      user_id: this.user.id
    };


    this.verifySubscription = this.extractedUserService.extractUser(formData, this.user.id).subscribe((response) => {
      this.loadingService.setLoadingState(false)
      if (!response.success) {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: `${response.message}`, sticky: true })

      } else {
        this.messageService.add({ severity: 'success', summary: 'Submitted', detail: `Account verification Submitted` })
        if (response.notification) {
          this.notificationService.updateUserNotificationData(response.notification!);
        }
        this.authService.refreshUserData().subscribe(() => {
          this.router.navigate(['/client-dashboard']);
        });


      }
    },
      (error) => {
        console.log(error)
      });
  }

  onRemoveFile(file: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(file), 1);
    // console.log(this.uploadedFiles);
  }

}
