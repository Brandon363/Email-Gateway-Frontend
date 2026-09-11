import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ExtractedUserDTO, ExtractedUserResponse } from '../models/extracted_user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExtractedUserService {
  private baseURL = environment.baseUrl;
  private subUrl = 'extracted_user';
  private allActiveConfigs = new BehaviorSubject<ExtractedUserDTO[]>([]);


  public selectedConfig!: ExtractedUserDTO;

  constructor(
    private httpclient: HttpClient
  ) { }


  mapToResponse(data: any): ExtractedUserResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      extracted_user: data.extracted_user || null,
      extracted_users: data.extracted_users || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }


  updateUserData(configs: ExtractedUserDTO[] | ExtractedUserDTO) {
    if (Array.isArray(configs)) {
      this.allActiveConfigs.next(configs);
    } else {
      const current = this.allActiveConfigs.getValue();
      current.push(configs);
      this.allActiveConfigs.next(current);
    }
  }


  retrieveUserData(): Observable<ExtractedUserDTO[]> {
    return this.allActiveConfigs.asObservable();
  }


  extractUser(formData: any, user_id: number): Observable<ExtractedUserResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/extract-user/${user_id}`, formData).pipe(
      map((response: any) => {
        // console.log(response);
        const extractedUserResponse = this.mapToResponse(response);
        return extractedUserResponse;
      })
    );
  }


  getAllActiveExtractedUsers(): Observable<ExtractedUserResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-all-active-extracted-users`).pipe(
      map((response: any) => {
        // console.log(response)
        const extractedUserResponse = this.mapToResponse(response);
        if (extractedUserResponse.success && extractedUserResponse.extracted_users) {
          this.updateUserData(extractedUserResponse.extracted_users);
        }
        return extractedUserResponse;
      })
    )
  }

  getByUserId(id: number): Observable<ExtractedUserResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-active-extracted-user-by-id/${id}`).pipe(
      map((response: any) => {
        const extractedUserResponse = this.mapToResponse(response);
        return extractedUserResponse;
      })
    )
  }

  deleteExtractedUserById(id: number): Observable<ExtractedUserResponse> {
    return this.httpclient.delete(`${this.baseURL}/${this.subUrl}/delete-extracted-user/${id}`).pipe(
      map((response: any) => {
        const extractedUserResponse = this.mapToResponse(response);
        return extractedUserResponse;
      })
    );
  }
}
