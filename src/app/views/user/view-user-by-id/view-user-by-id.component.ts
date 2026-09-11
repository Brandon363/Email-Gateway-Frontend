import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDTO, UserVerifificationRequest } from '../../../models/user.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedModules } from '../../shared/shared_modules';
import { ExtractedUserDTO } from '../../../models/extracted_user.interface';
import { DocumentService } from '../../../services/document.service';
import { VerificationStatus } from '../../../models/enum.interface';
import { VerificationTrackingComponent } from "../verification-tracking/verification-tracking.component";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-view-user-by-id',
  imports: [SharedModules, VerificationTrackingComponent],
  templateUrl: './view-user-by-id.component.html',
  styleUrl: './view-user-by-id.component.scss'
})
export class ViewUserByIdComponent implements OnInit, OnDestroy {

  // @ViewChild('chatSingleComponent') chatSingleComponent!: ChatSingleComponent;

  userId!: number;
  user!: UserDTO;
  loggedInUser!: UserDTO;
  extractedUser!: ExtractedUserDTO;
  comparisons: { field: string, userValue: any, extractedValue: any, matched: boolean, confidence: any }[] = [];
  correctMatches: number = 0;

  greenColor: string = 'rgb(7, 170, 7)';
  redColor: string = 'rgb(170, 7, 7)';

  getAllSubscription!: Subscription;
  retrieveSubscription!: Subscription;
  chatMessageSubscription!: Subscription;
  viewDocumentSubscription!: Subscription;
  verificationStatus = VerificationStatus
  verificationNotes: string = '';


  showChat: boolean = false;
  pdfUrl: any = null;


  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private documentService: DocumentService,
    private confirmationService: ConfirmationService
  ) { }


  ngOnDestroy(): void {
    this.getAllSubscription?.unsubscribe();
    this.retrieveSubscription?.unsubscribe();
    this.viewDocumentSubscription?.unsubscribe();
  }


  ngOnInit(): void {
    this.loggedInUser = this.authService.getCurrentUser();
    this.loadingService.setLoadingState(true);
    const resultId = this.route.snapshot.paramMap.get('userId');
    if (resultId) {
      this.userId = parseInt(resultId);
    }

    this.getResultsById();
  }


  getResultsById() {
    if (this.userId) {
      this.loadingService.setLoadingState(true);
      this.getAllSubscription = this.userService.getByUserId(this.userId).subscribe((response) => {
        this.loadingService.setLoadingState(false);
        if (response.success) {
          if (response.user) {
            this.user = response.user;
            if (response.user.extracted_users && response.user.extracted_users.length > 0) {
              this.extractedUser = response.user.extracted_users![response.user.extracted_users!.length - 1];
              this.comparisons = this.compareFields();
              this.viewDocument(this.user.id);

            }
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      })
    }
  }


  breadcomb_menu_items = [
    {
      label: 'All Clients',
      routerLink: '/clients'
    },
    { label: 'Client Details' }
  ];
  home = { icon: 'pi pi-home', routerLink: '/home' };


  compareFields() {
    const fields: { field: string, property: string }[] = [
      { field: 'First Name', property: 'first_name' },
      { field: 'Last Name', property: 'last_name' },
      { field: 'ID Number', property: 'id_number' },
      { field: 'Date of Birth', property: 'date_of_birth' },
      { field: 'Place of Birth', property: 'place_of_birth' },
      { field: 'Village of Origin', property: 'village_of_origin' }
    ];
    const comparisons = fields.map(field => ({
      field: field.field,
      userValue: this.user[field.property as keyof UserDTO],
      extractedValue: this.extractedUser[field.property as keyof ExtractedUserDTO],
      matched: this.user[field.property as keyof UserDTO] === this.extractedUser[field.property as keyof ExtractedUserDTO],
      confidence: this.extractedUser[`${field.property}_confidence` as keyof ExtractedUserDTO],
    }));

    this.correctMatches = comparisons.filter(item => item.matched).length;
    return comparisons;
  }



  getComparison(comparisons: any[], field: string) {
    return comparisons.find(comparison => comparison.field === field);
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

  onVerifyUser() {
    this.confirmationService.confirm({
      message: `Are you sure you want to VERIFY this user?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-circle',
      rejectButtonStyleClass: 'p-button-info',
      accept: () => {
        this.loadingService.setLoadingState(true);
        const verificationRequest: UserVerifificationRequest = {
          user_id: this.user.id,
          verifier_id: this.loggedInUser.id,
          verification_notes: this.verificationNotes || null,
        }
        this.userService.verifyUser(verificationRequest).subscribe((response) => {
          this.loadingService.setLoadingState(false);
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'User Verified', detail: `User has been verified successfully.` });
            this.getResultsById();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        });
      },
      reject: () => {
      }
    });
  }


  onRejectUser() {
    this.confirmationService.confirm({
      message: `Are you sure you want to REJECT this user?`,  // Replace with your confirmation message
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.loadingService.setLoadingState(true);
        const verificationRequest: UserVerifificationRequest = {
          user_id: this.user.id,
          verifier_id: this.loggedInUser.id,
          verification_notes: this.verificationNotes || null,
        }
        this.userService.rejectUserVerification(verificationRequest).subscribe((response) => {
          this.loadingService.setLoadingState(false); 
          if (response.success) {
            this.messageService.add({ severity: 'success', summary: 'User Rejected', detail: `User has been rejected successfully.` });
            this.getResultsById();
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          } 
        });
      },
      reject: () => {}
    });
  }

}