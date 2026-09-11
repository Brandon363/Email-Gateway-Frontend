import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ExtractedTemporaryLossApplicationDTO, ExtractedTemporaryLossApplicationResponse } from '../models/extracted_temporary_loss_application.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExtractedTemporaryLossApplicationService {
  private baseURL = environment.baseUrl;
  private subUrl = 'extracted_temporary_loss_application';
  private allActiveConfigs = new BehaviorSubject<ExtractedTemporaryLossApplicationDTO[]>([]);


  public selectedConfig!: ExtractedTemporaryLossApplicationDTO;

  constructor(
    private httpclient: HttpClient
  ) { }


  mapToResponse(data: any): ExtractedTemporaryLossApplicationResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      extractedLemporaryLossApplication: data.extracted_temporary_loss_application || null,
      extractedTemporaryLossApplications: data.extracted_temporary_loss_applications || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }


  updateUserData(configs: ExtractedTemporaryLossApplicationDTO[] | ExtractedTemporaryLossApplicationDTO) {
    if (Array.isArray(configs)) {
      this.allActiveConfigs.next(configs);
    } else {
      const current = this.allActiveConfigs.getValue();
      current.push(configs);
      this.allActiveConfigs.next(current);
    }
  }


  retrieveUserData(): Observable<ExtractedTemporaryLossApplicationDTO[]> {
    return this.allActiveConfigs.asObservable();
  }


  extractUser(files: FormData, user_id: number): Observable<ExtractedTemporaryLossApplicationResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/extract-temporary-loss-application/${user_id}`, files).pipe(
      map((response: any) => {
        // console.log(response);
        const ExtractedTemporaryLossApplicationResponse = this.mapToResponse(response);
        return ExtractedTemporaryLossApplicationResponse;
      })
    );
  }
}
