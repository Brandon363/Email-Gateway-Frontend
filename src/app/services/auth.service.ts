import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserCreateRequest, UserDTO, UserLoginRequest, UserResponse } from '../models/user.interface';
import { NotificationService } from './notification.service';
import { EntityStatus, VerificationStatus } from '../models/enum.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = environment.baseUrl;
  private subUrl = "user";

  // private currentUser = new BehaviorSubject<TokenData>(null as unknown as UserDTO);
  private currentUser = new BehaviorSubject<UserDTO | null>(null);
  public authStatus = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private notificationService: NotificationService
  ) { }

  map_to_response(data: any): UserResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      user: data.user || null,
      users: data.users || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
      token: data.token || null,
      token_type: data.token_type || null,
    };
  }



  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  getCurrentUser(): UserDTO {
    const cached = sessionStorage.getItem('currentUser')
    if (cached) {
      const token_data = JSON.parse(cached) as UserDTO;
      const user: UserDTO = {
        id: token_data.id,
        first_name: token_data.first_name || '',
        last_name: token_data.last_name || '',
        email: token_data.email,
        user_role: token_data.user_role,
        entity_status: token_data.entity_status,
        date_created: token_data.date_created,
        id_number: token_data.id_number || '',
        date_of_birth: token_data.date_of_birth || '',
        village_of_origin: token_data.village_of_origin || '',
        place_of_birth: token_data.place_of_birth || '',
        is_logged_in: token_data.is_logged_in || false,
        must_change_password: token_data.must_change_password || false,
        verification_status: token_data.verification_status || VerificationStatus.UNVERIFIED,
      }
      return user;
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'Logged Out', detail: `User details not found, login again` });
      // this.logout()
      this.router.navigate(['/login']);
      sessionStorage.clear();
      this.authStatus.next(false);
      return {} as UserDTO
    }
  }



  login(data: UserLoginRequest): Observable<UserResponse> {
    return this.httpClient.post(`${this.baseURL}/${this.subUrl}/login`, data).pipe(
      map((response: any) => {
        const loginResponse: UserResponse = this.map_to_response(response);

        if (loginResponse.success && loginResponse.user) {
          this.currentUser.next(loginResponse.user);

          sessionStorage.setItem('currentUser', JSON.stringify(loginResponse.user));
          if (loginResponse.token) {
            sessionStorage.setItem('token', loginResponse.token);
          }

          this.authStatus.next(true);
        }

        return loginResponse;
      })
    );
  }



  register(create_request: UserCreateRequest): Observable<UserResponse> {
    console.log(create_request)
    return this.httpClient.post(`${this.baseURL}/${this.subUrl}/create-user`, create_request).pipe(
      map((response: any) => {
        const loginResponse: UserResponse = this.map_to_response(response);

        return loginResponse;
      })
    );
  }



  changePassword(oldPassword: string, newPassword: string): Observable<UserResponse> {
    const user = this.getCurrentUser();
    return this.httpClient.post(`${this.baseURL}/${this.subUrl}/change-password`, {
      user_id: user?.id,
      old_password: oldPassword,
      new_password: newPassword
    }).pipe(
      map((response: any) => {
        const res = this.map_to_response(response);
        if (res.success) {
          const cached = sessionStorage.getItem('currentUser');
          if (cached) {
            const parsed = JSON.parse(cached);
            parsed.must_change_password = false;
            sessionStorage.setItem('currentUser', JSON.stringify(parsed));
            this.currentUser.next(parsed);
          }
        }
        return res;
      })
    );
  }

  forgotPassword(email: string): Observable<UserResponse> {
    return this.httpClient.post(`${this.baseURL}/${this.subUrl}/forgot-password`, { email }).pipe(
      map((response: any) => this.map_to_response(response))
    );
  }

  getAllActiveUsers(): Observable<any> {
    return this.httpClient.get(`${this.baseURL}/${this.subUrl}/all-active-users`);
  }

  deleteUser(userId: number): Observable<UserResponse> {
    return this.httpClient.delete(`${this.baseURL}/${this.subUrl}/${userId}`).pipe(
      map((response: any) => this.map_to_response(response))
    );
  }

  logout(): Observable<UserResponse> {
    const user = this.getCurrentUser();
    return this.httpClient.post(`${this.baseURL}/${this.subUrl}/logout/` + user.id, {}).pipe(
      map((response: any) => {
        const userResponse = this.map_to_response(response);
        if (userResponse.success) {
          this.currentUser.next(null);
          this.authStatus.next(false);
          sessionStorage.clear();
        }

        return userResponse;
      })
    )
  }


  clearLocalStorage() {
    localStorage.clear()
    sessionStorage.clear()
  }


  isAuthenticated(): Observable<boolean> {
    const user = this.getCurrentUser();
    if (!user) {
      return of(false);
    }

    return this.httpClient.get<UserResponse>(`${this.baseURL}/${this.subUrl}/is-user-logged-in/` + user.id).pipe(
      map((user: UserResponse) => {
        if (!user.success || !user.user) {
          this.logout()
          return false;
        }
        user.user!.is_logged_in = true;
        this.currentUser.next(user.user);
        return true;
      }),
      catchError(() => of(false))
    );
  }


  getToken() {
    return sessionStorage.getItem('token')
  }

  refreshUserData() {
    const user = this.getCurrentUser();

    return this.httpClient.get<UserResponse>(`${this.baseURL}/${this.subUrl}/is-user-logged-in/` + user.id).pipe(
      map((user: UserResponse) => {
        if (!user.success || !user.user) {
          this.logout()
          return false;
        }
        user.user!.is_logged_in = true;
        this.currentUser.next(user.user);
        sessionStorage.setItem('currentUser', JSON.stringify(user.user));
        return true;
      }),
      catchError(() => of(false))
    );
  }

}
