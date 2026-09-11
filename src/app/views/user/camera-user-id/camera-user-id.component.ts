import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { UserDTO } from '../../../models/user.interface';
import { AuthService } from '../../../services/auth.service';
import { ExtractedTemporaryLossApplicationService } from '../../../services/extracted-temporary-loss-application.service';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notification.service';
import { SharedModules } from '../../shared/shared_modules';
import { ExtractedUserService } from '../../../services/extracted-user.service';

@Component({
  selector: 'app-camera-user-id',
  imports: [SharedModules],
  templateUrl: './camera-user-id.component.html',
  styleUrl: './camera-user-id.component.scss'
})
export class CameraUserIdComponent implements OnInit, OnDestroy {

  @ViewChild('webcam') webcam: any;

  trigger: Subject<void> = new Subject<void>();
  images: WebcamImage[] = [];

  verifySubscription!: Subscription;
  user!: UserDTO;


  breadcomb_menu_items = [
    {
      label: 'My Account',
      routerLink: '/account'
    },
    { label: 'Capture ID Document' }
  ];
  // home = { icon: 'pi pi-home', routerLink: '/admin-dashboard' };

  constructor(
    public messageService: MessageService,
    private http: HttpClient,
    private loadingService: LoadingService,
    private extractedUserService: ExtractedUserService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private notificationService: NotificationService) { }


  ngOnDestroy(): void {
    this.verifySubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    // throw new Error('Method not implemented.');
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  responseData: any;
  isLoading = false;

  handleImage(webcamImage: WebcamImage): void {
    this.images.push(webcamImage);
    // this.uploadImage();
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
    // this.previewImages.splice(index, 1);
  }


  uploadImage() {
    this.loadingService.setLoadingState(true)
    const formData = new FormData();
    this.images.forEach((image, index) => {
      this.dataURLtoBlob(image.imageAsDataUrl).then(blob => {
        const file = new File([blob], `image${index}.jpg`, { type: 'image/jpeg' });
        formData.append('image_files', file);
        if (index === this.images.length - 1) {
          this.uploadForm(formData);
        }
      });
    });
  }



  uploadForm(formData: FormData) {
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
          this.router.navigate(['/national-identity-card/' + response.extracted_user?.id]);
        });


      }
    },
      (error) => {
        console.log(error)
      });
  }

  async dataURLtoBlob(dataurl: string): Promise<Blob> {
    const response = await fetch(dataurl);
    return response.blob();
  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
      this.messageService.add({ severity: 'error', summary: 'Camera Access Denied', detail: 'Please allow camera access to use this feature.' });
    }
  }


  @HostListener('document:keydown.enter', ['$event'])
  handleGlobalEnter() {
    if (this.images.length >= 1) {
      return
    }
    else {
      return this.triggerSnapshot()
    }
  }

  width = window.innerWidth < 768 ? 280 : 700;

  // @HostListener('window:resize')
  // onResize() {
  //   this.width = window.innerWidth < 768 ? 360 : 800;
  // }

}
