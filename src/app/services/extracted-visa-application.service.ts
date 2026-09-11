import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ExtractedVisaApplicationDTO, ExtractedVisaApplicationResponse } from '../models/extracted-visa-application.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExtractedVisaApplicationService {
private baseURL = environment.baseUrl;
  private subUrl = 'extracted_visa_application';
  private allActiveConfigs = new BehaviorSubject<ExtractedVisaApplicationDTO[]>([]);


  public selectedConfig!: ExtractedVisaApplicationDTO;

  constructor(
    private httpclient: HttpClient
  ) { }


  mapToResponse(data: any): ExtractedVisaApplicationResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      extracted_visa_application: data.extracted_visa_application || null,
      extracted_visa_applications: data.extracted_visa_applications || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }


  updateUserData(configs: ExtractedVisaApplicationDTO[] | ExtractedVisaApplicationDTO) {
    if (Array.isArray(configs)) {
      this.allActiveConfigs.next(configs);
    } else {
      const current = this.allActiveConfigs.getValue();
      current.push(configs);
      this.allActiveConfigs.next(current);
    }
  }


  retrieveUserData(): Observable<ExtractedVisaApplicationDTO[]> {
    return this.allActiveConfigs.asObservable();
  }


  extractUser(files: FormData, user_id: number): Observable<ExtractedVisaApplicationResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/extract-visa-application/${user_id}`, files).pipe(
      map((response: any) => {
        // console.log(response);
        const ExtractedVisaApplicationResponse = this.mapToResponse(response);
        return ExtractedVisaApplicationResponse;
      })
    );
  }

  
    getAllActiveExtractedVisaApplications(): Observable<ExtractedVisaApplicationResponse> {
      return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-all-extracted-visa-applications`).pipe(
        map((response: any) => {
          // console.log(response)
          const VisaApplicationResponse = this.mapToResponse(response);
          if (VisaApplicationResponse.success && VisaApplicationResponse.extracted_visa_applications) {
            this.updateUserData(VisaApplicationResponse.extracted_visa_applications);
          }
          return VisaApplicationResponse;
        })
      )
    }
    getExtractedVisaApplicationById(application_id: number): Observable<ExtractedVisaApplicationResponse> {
      return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-extracted-visa-application/${application_id}`).pipe(
        map((response: any) => {
          // console.log(response)
          const VisaApplicationResponse = this.mapToResponse(response);
          // if (VisaApplicationResponse.success && VisaApplicationResponse.extracted_visa_applications) {
          //   this.updateUserData(VisaApplicationResponse.extracted_visa_applications);
          // }
          return VisaApplicationResponse;
        })
      )
    }


    deleteApplicationById(id: number): Observable<ExtractedVisaApplicationResponse> {
        return this.httpclient.delete(`${this.baseURL}/${this.subUrl}/delete-visa-application/${id}`).pipe(
          map((response: any) => {
            console.log(response)
            const VisaApplicationResponse = this.mapToResponse(response);
            if (VisaApplicationResponse.success && VisaApplicationResponse.extracted_visa_application) {
              const current = this.allActiveConfigs.getValue();
              const updated = current.filter(p => p.id !== VisaApplicationResponse.extracted_visa_application?.id);
              this.allActiveConfigs.next(updated);
            }
    
            return VisaApplicationResponse;
          })
        );
      }
  
}
