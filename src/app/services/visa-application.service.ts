import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { VisaApplicationDTO, VisaApplicationResponse, VisaApplicationUpdateRequest } from '../models/visa-application.interface';
import { HttpClient } from '@angular/common/http';
import { VerificationTrackingService } from './verification-tracking.service';

@Injectable({
  providedIn: 'root'
})
export class VisaApplicationService {
  private baseURL = environment.baseUrl;
  private subUrl = 'visa_application';
  private allActiveApplications = new BehaviorSubject<VisaApplicationDTO[]>([]);


  public selectedApplication!: VisaApplicationDTO;

  constructor(
    private httpclient: HttpClient,
    private verificationTrackingService: VerificationTrackingService
  ) { }


  mapToResponse(data: any): VisaApplicationResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      visa_application: data.visa_application || null,
      visa_applications: data.visa_applications || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }


  updateApplicationData(configs: VisaApplicationDTO[] | VisaApplicationDTO) {
    if (Array.isArray(configs)) {
      this.allActiveApplications.next(configs);
    } else {
      const current = this.allActiveApplications.getValue();
      current.push(configs);
      this.allActiveApplications.next(current);
    }
  }


  retrieveApplicationData(): Observable<VisaApplicationDTO[]> {
    return this.allActiveApplications.asObservable();
  }


  getAllActiveApplications(): Observable<VisaApplicationResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-all-visa-applications`).pipe(
      map((response: any) => {
        // console.log(response)
        const VisaApplicationResponse = this.mapToResponse(response);
        if (VisaApplicationResponse.success && VisaApplicationResponse.visa_applications) {
          this.updateApplicationData(VisaApplicationResponse.visa_applications);
        }
        return VisaApplicationResponse;
      })
    )
  }


  editApplication(id: number, updateRequest: VisaApplicationUpdateRequest): Observable<VisaApplicationResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/update-visa-application/${id}`, updateRequest).pipe(
      map((response: any) => {
        const VisaApplicationResponse = this.mapToResponse(response);
        if (VisaApplicationResponse.success && VisaApplicationResponse.visa_application) {
          const current = this.allActiveApplications.getValue();
          const updated = current.map((p: any) =>
            p.id === VisaApplicationResponse.visa_application?.id ? VisaApplicationResponse.visa_application : p
          );
          this.allActiveApplications.next(updated);
        }

        return VisaApplicationResponse;
      })
    );
  }


  saveApplicationForReview(id: number, verifier_id: number, updateRequest: VisaApplicationUpdateRequest): Observable<VisaApplicationResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/save-visa-application-for-review/${id}/${verifier_id}`, updateRequest).pipe(
      map((response: any) => {
        const VisaApplicationResponse = this.mapToResponse(response);
        if (VisaApplicationResponse.success && VisaApplicationResponse.visa_application) {
          const current = this.allActiveApplications.getValue();
          const updated = current.map((p: any) =>
            p.id === VisaApplicationResponse.visa_application?.id ? VisaApplicationResponse.visa_application : p
          );
          this.allActiveApplications.next(updated);
        }

        return VisaApplicationResponse;
      })
    );
  }


  verifyDocuments(application_id: number, verifier_id: number): Observable<VisaApplicationResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/verify-documents/${application_id}/${verifier_id}`, {}).pipe(
      map((response: any) => {
        const VisaApplicationResponse = this.mapToResponse(response);
        if (VisaApplicationResponse.success && VisaApplicationResponse.visa_application) {
          const current = this.allActiveApplications.getValue();
          const updated = current.map((p: any) =>
            p.id === VisaApplicationResponse.visa_application?.id ? VisaApplicationResponse.visa_application : p
          );
          this.allActiveApplications.next(updated);
        }

        return VisaApplicationResponse;
      })
    );
  }


  approveApplication(application_id: number, approver_id: number): Observable<VisaApplicationResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/approve-visa-application/${application_id}/${approver_id}`, {}).pipe(
      map((response: any) => {
        const VisaApplicationResponse = this.mapToResponse(response);
        if (VisaApplicationResponse.success && VisaApplicationResponse.visa_application) {
          const current = this.allActiveApplications.getValue();
          const updated = current.map((p: any) =>
            p.id === VisaApplicationResponse.visa_application?.id ? VisaApplicationResponse.visa_application : p
          );
          this.allActiveApplications.next(updated);
        }

        return VisaApplicationResponse;
      })
    );
  }


  declineApplication(application_id: number, decliner_id: number): Observable<VisaApplicationResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/decline-visa-application/${application_id}/${decliner_id}`, {}).pipe(
      map((response: any) => {
        const VisaApplicationResponse = this.mapToResponse(response);
        if (VisaApplicationResponse.success && VisaApplicationResponse.visa_application) {
          const current = this.allActiveApplications.getValue();
          const updated = current.map((p: any) =>
            p.id === VisaApplicationResponse.visa_application?.id ? VisaApplicationResponse.visa_application : p
          );
          this.allActiveApplications.next(updated);
        }

        return VisaApplicationResponse;
      })
    );
  }


  deleteApplicationById(id: number): Observable<VisaApplicationResponse> {
    return this.httpclient.delete(`${this.baseURL}/${this.subUrl}/delete-visa-application/${id}`).pipe(
      map((response: any) => {
        console.log(response)
        const VisaApplicationResponse = this.mapToResponse(response);
        if (VisaApplicationResponse.success && VisaApplicationResponse.visa_application) {
          const current = this.allActiveApplications.getValue();
          const updated = current.filter(p => p.id !== VisaApplicationResponse.visa_application?.id);
          this.allActiveApplications.next(updated);
        }

        return VisaApplicationResponse;
      })
    );
  }


  getApplicationById(id: number): Observable<VisaApplicationResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-visa-application-by-id/${id}`).pipe(
      map((response: any) => {
        const VisaApplicationResponse = this.mapToResponse(response);
        return VisaApplicationResponse;
      })
    )
  }

  createApplication(createRequest: VisaApplicationDTO): Observable<VisaApplicationResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/create-visa-application`, createRequest).pipe(
      map((response: any) => {
        console.log(response)
        const VisaApplicationResponse = this.mapToResponse(response);
        if (VisaApplicationResponse.success && VisaApplicationResponse.visa_application) {
          this.updateApplicationData(VisaApplicationResponse.visa_application);
        }
        return VisaApplicationResponse;
      })
    );
  }

}