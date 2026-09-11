import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserDTO, UserResponse, UserUpdateRequest, UserVerifificationRequest } from '../models/user.interface';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { VerificationTrackingService } from './verification-tracking.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL = environment.baseUrl;
  private subUrl = 'user';
  private allActiveConfigs = new BehaviorSubject<UserDTO[]>([]);


  public selectedConfig!: UserDTO;

  constructor(
    private httpclient: HttpClient,
    private verificationTrackingService: VerificationTrackingService
  ) { }


  mapToResponse(data: any): UserResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      user: data.user || null,
      users: data.users || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }

  
  updateUserData(configs: UserDTO[] | UserDTO) {
    if (Array.isArray(configs)) {
      this.allActiveConfigs.next(configs);
    } else {
      const current = this.allActiveConfigs.getValue();
      current.push(configs);
      this.allActiveConfigs.next(current);
    }
  }


  retrieveUserData(): Observable<UserDTO[]> {
    return this.allActiveConfigs.asObservable();
  }

 
  getAllActiveUsers(): Observable<UserResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-all-active-users`).pipe(
      map((response: any) => {
        // console.log(response)
        const UserResponse = this.mapToResponse(response);
        if (UserResponse.success && UserResponse.users) {
          this.updateUserData(UserResponse.users);
        }
        return UserResponse;
      })
    )
  }


  editUser(id: number, updateRequest: UserUpdateRequest): Observable<UserResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/update-user/${id}`, updateRequest).pipe(
      map((response: any) => {
        const UserResponse = this.mapToResponse(response);
        if (UserResponse.success && UserResponse.user) {
          const current = this.allActiveConfigs.getValue();
          const updated = current.map((p: any) =>
            p.id === UserResponse.user?.id ? UserResponse.user : p
          );
          this.allActiveConfigs.next(updated);
        }

        return UserResponse;
      })
    );
  }


  verifyUser(request: UserVerifificationRequest): Observable<UserResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/verify-user`, request).pipe(
      map((response: any) => {
        const UserResponse = this.mapToResponse(response);
        if (UserResponse.success && UserResponse.user) {
          const current = this.allActiveConfigs.getValue();
          const updated = current.map((p: any) =>
            p.id === UserResponse.user?.id ? UserResponse.user : p
          );
          this.allActiveConfigs.next(updated);

          // this.verificationTrackingService.updateVerificationData();
        }

        return UserResponse;
      })
    );
  }


  rejectUserVerification(request: UserVerifificationRequest): Observable<UserResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/reject-user-verification`, request).pipe(
      map((response: any) => {
        const UserResponse = this.mapToResponse(response);
        if (UserResponse.success && UserResponse.user) {
          const current = this.allActiveConfigs.getValue();
          const updated = current.map((p: any) =>
            p.id === UserResponse.user?.id ? UserResponse.user : p
          );
          this.allActiveConfigs.next(updated);
        }

        return UserResponse;
      })
    );
  }



  resubmitVerification(userId: number): Observable<UserResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/resubmit-user-verification/${userId}`, {}).pipe(
      map((response: any) => {
        const UserResponse = this.mapToResponse(response);
        if (UserResponse.success && UserResponse.user) {
          const current = this.allActiveConfigs.getValue();
          const updated = current.map((p: any) =>
            p.id === UserResponse.user?.id ? UserResponse.user : p
          );
          this.allActiveConfigs.next(updated);
        }

        return UserResponse;
      })
    );
  }


  deleteUserById(id: number): Observable<UserResponse> {
    return this.httpclient.delete(`${this.baseURL}/${this.subUrl}/delete-user/${id}`).pipe(
      map((response: any) => {
        console.log(response)
        const UserResponse = this.mapToResponse(response);
        if (UserResponse.success && UserResponse.user) {
          const current = this.allActiveConfigs.getValue();
          const updated = current.filter(p => p.id !== UserResponse.user?.id);
          this.allActiveConfigs.next(updated);
        }

        return UserResponse;
      })
    );
  }


  getByUserId(id: number): Observable<UserResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-active-user-by-id/${id}`).pipe(
      map((response: any) => {
        const UserResponse = this.mapToResponse(response);
        return UserResponse;
      })
    )
  }

  createUser(createRequest: UserDTO): Observable<UserResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/create-user`, createRequest).pipe(
      map((response: any) => {
        console.log(response)
        const UserResponse = this.mapToResponse(response);
        if (UserResponse.success && UserResponse.user) {
          this.updateUserData(UserResponse.user);
        }
        return UserResponse;
      })
    );
  }

}