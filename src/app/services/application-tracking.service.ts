import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApplicationTrackingDTO, ApplicationTrackingResponse } from '../models/application_tracking.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationTrackingService {
private baseURL = environment.baseUrl;
  private subUrl = 'application-tracking';
  private allActiveVerificationTrackings = new BehaviorSubject<ApplicationTrackingDTO[]>([]);


  public selectedClaim!: ApplicationTrackingDTO;

  constructor(
    private httpclient: HttpClient
  ) { }


  mapToResponse(data: any): ApplicationTrackingResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      applicationTracking: data.application_tracking || null,
      applicationTrackings: data.application_trackings || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }


  updateVerificationData(configs: ApplicationTrackingDTO[] | ApplicationTrackingDTO) {
    if (Array.isArray(configs)) {
      this.allActiveVerificationTrackings.next(configs);
    } else {
      const current = this.allActiveVerificationTrackings.getValue();
      current.push(configs);
      this.allActiveVerificationTrackings.next(current);
    }
  }


  retrieveVerificationTrackingData(): Observable<ApplicationTrackingDTO[]> {
    return this.allActiveVerificationTrackings.asObservable();
  }


  // getAllActiveVerificationTrackings(): Observable<ApplicationTrackingResponse> {
  //   return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-all-active-verification-trackings`).pipe(
  //     map((response: any) => {
  //       // console.log(response)
  //       const ApplicationTrackingResponse = this.mapToResponse(response);
  //       if (ApplicationTrackingResponse.success && ApplicationTrackingResponse.verificationTrackings) {
  //         this.updateVerificationData(ApplicationTrackingResponse.verificationTrackings);
  //       }
  //       return ApplicationTrackingResponse;
  //     })
  //   )
  // }


  getAllActiveUserVerificationTrackings(user_id: number): Observable<ApplicationTrackingResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-application-trackings-by-application-id/` + user_id).pipe(
      map((response: any) => {
        // console.log(response)
        const ApplicationTrackingResponse = this.mapToResponse(response);
        if (ApplicationTrackingResponse.success && ApplicationTrackingResponse.applicationTrackings) {
          this.updateVerificationData(ApplicationTrackingResponse.applicationTrackings);
        }
        return ApplicationTrackingResponse;
      })
    )
  }

  getByVerificationTrackingId(id: number): Observable<ApplicationTrackingResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-application-tracking-by-id/${id}`).pipe(
      map((response: any) => {
        const ApplicationTrackingResponse = this.mapToResponse(response);
        return ApplicationTrackingResponse;
      })
    )
  }

}