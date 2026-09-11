import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { TemporaryLossApplicationDTO, TemporaryLossApplicationResponse, TemporaryLossApplicationUpdateRequest } from '../models/temporary_loss_application.interface';
import { HttpClient } from '@angular/common/http';
import { VerificationTrackingService } from './verification-tracking.service';

@Injectable({
  providedIn: 'root'
})
export class TemporaryLossApplicationService {
  private baseURL = environment.baseUrl;
  private subUrl = 'temporary_loss_application';
  private allActiveApplications = new BehaviorSubject<TemporaryLossApplicationDTO[]>([]);


  public selectedApplication!: TemporaryLossApplicationDTO;

  constructor(
    private httpclient: HttpClient,
    private verificationTrackingService: VerificationTrackingService
  ) { }


  mapToResponse(data: any): TemporaryLossApplicationResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      temporaryLossApplication: data.temporary_loss_application || null,
      temporaryLossApplications: data.temporary_loss_applications || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }


  updateApplicationData(configs: TemporaryLossApplicationDTO[] | TemporaryLossApplicationDTO) {
    if (Array.isArray(configs)) {
      this.allActiveApplications.next(configs);
    } else {
      const current = this.allActiveApplications.getValue();
      current.push(configs);
      this.allActiveApplications.next(current);
    }
  }


  retrieveApplicationData(): Observable<TemporaryLossApplicationDTO[]> {
    return this.allActiveApplications.asObservable();
  }


  getAllActiveApplications(): Observable<TemporaryLossApplicationResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-all-temporary-loss-applications`).pipe(
      map((response: any) => {
        // console.log(response)
        const TemporaryLossApplicationResponse = this.mapToResponse(response);
        if (TemporaryLossApplicationResponse.success && TemporaryLossApplicationResponse.temporaryLossApplications) {
          this.updateApplicationData(TemporaryLossApplicationResponse.temporaryLossApplications);
        }
        return TemporaryLossApplicationResponse;
      })
    )
  }


  editApplication(id: number, updateRequest: TemporaryLossApplicationUpdateRequest): Observable<TemporaryLossApplicationResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/update-temporary-loss-application/${id}`, updateRequest).pipe(
      map((response: any) => {
        const TemporaryLossApplicationResponse = this.mapToResponse(response);
        if (TemporaryLossApplicationResponse.success && TemporaryLossApplicationResponse.temporaryLossApplication) {
          const current = this.allActiveApplications.getValue();
          const updated = current.map((p: any) =>
            p.id === TemporaryLossApplicationResponse.temporaryLossApplication?.id ? TemporaryLossApplicationResponse.temporaryLossApplication : p
          );
          this.allActiveApplications.next(updated);
        }

        return TemporaryLossApplicationResponse;
      })
    );
  }


  editApplicationAndDependents(id: number, updateRequest: TemporaryLossApplicationUpdateRequest): Observable<TemporaryLossApplicationResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/update-temporary-loss-application-and-dependents/${id}`, updateRequest).pipe(
      map((response: any) => {
        const TemporaryLossApplicationResponse = this.mapToResponse(response);
        if (TemporaryLossApplicationResponse.success && TemporaryLossApplicationResponse.temporaryLossApplication) {
          const current = this.allActiveApplications.getValue();
          const updated = current.map((p: any) =>
            p.id === TemporaryLossApplicationResponse.temporaryLossApplication?.id ? TemporaryLossApplicationResponse.temporaryLossApplication : p
          );
          this.allActiveApplications.next(updated);
        }

        return TemporaryLossApplicationResponse;
      })
    );
  }


  verifyDocuments(application_id: number, verifier_id: number): Observable<TemporaryLossApplicationResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/verify-documents/${application_id}/${verifier_id}`, {}).pipe(
      map((response: any) => {
        const TemporaryLossApplicationResponse = this.mapToResponse(response);
        if (TemporaryLossApplicationResponse.success && TemporaryLossApplicationResponse.temporaryLossApplication) {
          const current = this.allActiveApplications.getValue();
          const updated = current.map((p: any) =>
            p.id === TemporaryLossApplicationResponse.temporaryLossApplication?.id ? TemporaryLossApplicationResponse.temporaryLossApplication : p
          );
          this.allActiveApplications.next(updated);
        }

        return TemporaryLossApplicationResponse;
      })
    );
  }


  // rejectUserVerification(request: UserVerifificationRequest): Observable<TemporaryLossApplicationResponse> {
  //   return this.httpclient.put(`${this.baseURL}/${this.subUrl}/reject-user-verification`, request).pipe(
  //     map((response: any) => {
  //       const TemporaryLossApplicationResponse = this.mapToResponse(response);
  //       if (TemporaryLossApplicationResponse.success && TemporaryLossApplicationResponse.user) {
  //         const current = this.allActiveApplications.getValue();
  //         const updated = current.map((p: any) =>
  //           p.id === TemporaryLossApplicationResponse.user?.id ? TemporaryLossApplicationResponse.user : p
  //         );
  //         this.allActiveApplications.next(updated);
  //       }

  //       return TemporaryLossApplicationResponse;
  //     })
  //   );
  // }



  // resubmitVerification(userId: number): Observable<TemporaryLossApplicationResponse> {
  //   return this.httpclient.put(`${this.baseURL}/${this.subUrl}/resubmit-user-verification/${userId}`, {}).pipe(
  //     map((response: any) => {
  //       const TemporaryLossApplicationResponse = this.mapToResponse(response);
  //       if (TemporaryLossApplicationResponse.success && TemporaryLossApplicationResponse.user) {
  //         const current = this.allActiveApplications.getValue();
  //         const updated = current.map((p: any) =>
  //           p.id === TemporaryLossApplicationResponse.user?.id ? TemporaryLossApplicationResponse.user : p
  //         );
  //         this.allActiveApplications.next(updated);
  //       }

  //       return TemporaryLossApplicationResponse;
  //     })
  //   );
  // }


  deleteApplicationById(id: number): Observable<TemporaryLossApplicationResponse> {
    return this.httpclient.delete(`${this.baseURL}/${this.subUrl}/delete-temporary-loss-application/${id}`).pipe(
      map((response: any) => {
        console.log(response)
        const TemporaryLossApplicationResponse = this.mapToResponse(response);
        if (TemporaryLossApplicationResponse.success && TemporaryLossApplicationResponse.temporaryLossApplication) {
          const current = this.allActiveApplications.getValue();
          const updated = current.filter(p => p.id !== TemporaryLossApplicationResponse.temporaryLossApplication?.id);
          this.allActiveApplications.next(updated);
        }

        return TemporaryLossApplicationResponse;
      })
    );
  }


  getApplicationById(id: number): Observable<TemporaryLossApplicationResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-temporary-loss-application-by-id/${id}`).pipe(
      map((response: any) => {
        const TemporaryLossApplicationResponse = this.mapToResponse(response);
        return TemporaryLossApplicationResponse;
      })
    )
  }

  createApplication(createRequest: TemporaryLossApplicationDTO): Observable<TemporaryLossApplicationResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/create-temporary-loss-application`, createRequest).pipe(
      map((response: any) => {
        console.log(response)
        const TemporaryLossApplicationResponse = this.mapToResponse(response);
        if (TemporaryLossApplicationResponse.success && TemporaryLossApplicationResponse.temporaryLossApplication) {
          this.updateApplicationData(TemporaryLossApplicationResponse.temporaryLossApplication);
        }
        return TemporaryLossApplicationResponse;
      })
    );
  }

}