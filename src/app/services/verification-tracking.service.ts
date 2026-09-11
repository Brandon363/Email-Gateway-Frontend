import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { VerificationTrackingDTO, VerificationTrackingResponse } from '../models/verification_tracking.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VerificationTrackingService {
  private baseURL = environment.baseUrl;
  private subUrl = 'verification-tracking';
  private allActiveVerificationTrackings = new BehaviorSubject<VerificationTrackingDTO[]>([]);


  public selectedClaim!: VerificationTrackingDTO;

  constructor(
    private httpclient: HttpClient
  ) { }


  mapToResponse(data: any): VerificationTrackingResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      verificationTracking: data.verification_tracking || null,
      verificationTrackings: data.verification_trackings || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }


  updateVerificationData(configs: VerificationTrackingDTO[] | VerificationTrackingDTO) {
    if (Array.isArray(configs)) {
      this.allActiveVerificationTrackings.next(configs);
    } else {
      const current = this.allActiveVerificationTrackings.getValue();
      current.push(configs);
      this.allActiveVerificationTrackings.next(current);
    }
  }


  retrieveVerificationTrackingData(): Observable<VerificationTrackingDTO[]> {
    return this.allActiveVerificationTrackings.asObservable();
  }


  // getAllActiveVerificationTrackings(): Observable<VerificationTrackingResponse> {
  //   return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-all-active-verification-trackings`).pipe(
  //     map((response: any) => {
  //       // console.log(response)
  //       const VerificationTrackingResponse = this.mapToResponse(response);
  //       if (VerificationTrackingResponse.success && VerificationTrackingResponse.verificationTrackings) {
  //         this.updateVerificationData(VerificationTrackingResponse.verificationTrackings);
  //       }
  //       return VerificationTrackingResponse;
  //     })
  //   )
  // }


  getAllActiveUserVerificationTrackings(user_id: number): Observable<VerificationTrackingResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-verification-trackings-by-user-id/` + user_id).pipe(
      map((response: any) => {
        // console.log(response)
        const VerificationTrackingResponse = this.mapToResponse(response);
        if (VerificationTrackingResponse.success && VerificationTrackingResponse.verificationTrackings) {
          this.updateVerificationData(VerificationTrackingResponse.verificationTrackings);
        }
        return VerificationTrackingResponse;
      })
    )
  }

  getByVerificationTrackingId(id: number): Observable<VerificationTrackingResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-verification-tracking-by-id/${id}`).pipe(
      map((response: any) => {
        const VerificationTrackingResponse = this.mapToResponse(response);
        return VerificationTrackingResponse;
      })
    )
  }

}