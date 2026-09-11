import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { MarkBulkAsReadRequest, NotificationDTO, NotificationResponse } from '../models/notification.interface';
import { Howl, Howler } from 'howler';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseURL = environment.baseUrl;
  private subUrl = "notification"

  private eventSource: EventSource | null = null;
  private destroy$ = new Subject<void>();

  public allActiveUserNotifications = new BehaviorSubject<NotificationDTO[]>([]);


  updateUserNotificationData(proposals: NotificationDTO[] | NotificationDTO) {
    if (Array.isArray(proposals)) {
      this.allActiveUserNotifications.next(proposals);
    } else {
      this.allActiveUserNotifications.next([...this.allActiveUserNotifications.getValue(), proposals]);
    }

  }


  retrieveUserNotificationData(): Observable<NotificationDTO[]> {
    return this.allActiveUserNotifications.asObservable();
  }


  notificationSound = new Howl({
    src: ['assets/audio/notifications/notification-2-269292.mp3']
  });

  newMessageSound = new Howl({
    src: ['assets/audio/notifications/new-notification-014-363678.mp3']
  });


  getServerSentEvents(): Observable<any> {
    return new Observable(observer => {
      // Create the EventSource outside Angular zone to prevent unnecessary change detection
      this.zone.runOutsideAngular(() => {
        const url = `${this.baseURL}/sse` + '/notifications/stream';
        this.eventSource = new EventSource(url);

        // Handle incoming messages
        this.eventSource.onmessage = (event) => {
          this.zone.run(() => {
            try {
              const data = JSON.parse(event.data);
              observer.next(data);
            } catch (e) {
              observer.error('Error parsing SSE data');
            }
          });
        };

        // Handle errors
        this.eventSource.onerror = (error) => {
          this.zone.run(() => {
            observer.error(error);
            this.closeSseConnection();
          });
        };
      });
    });
  }

  // close() {
  //   if (this.eventSource) {
  //     this.eventSource.close();
  //   }
  // }


  closeSseConnection(): void {

    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  constructor(private http: HttpClient, private zone: NgZone) { }

  private mapToNotificationResponse(response: any): NotificationResponse {
    return {
      success: response.success,
      statusCode: response.status_code,
      message: response.message,
      notification: response.notification || null,
      notifications: response.notifications || null,
      errors: response.errors || null,
    };
  }

  playNotificationSound() {
    // this.notificationSound.play()
  }

  playNewMessageSound() {
    // this.newMessageSound.play()
  }

  // ✅ Get all notifications for current user
  getAllNotificationsByUserId(user_id: number): Observable<NotificationResponse> {
    return this.http.get(`${this.baseURL}/${this.subUrl}/get-all-active-notifications-by-user-id/` + user_id).pipe(
      map((response: any) => {
        const notifcationResponse: NotificationResponse = this.mapToNotificationResponse(response)
        if (notifcationResponse.notifications) {
          this.updateUserNotificationData(notifcationResponse.notifications);
        }
        return notifcationResponse;
      }),
    );
  }

  // ✅ Mark a single notification as read
  markAsRead(notificationId: number): Observable<NotificationResponse> {
    return this.http.put(`${this.baseURL}/${this.subUrl}/mark-as-read/${notificationId}`, {}).pipe(
      map(response => this.mapToNotificationResponse(response))
    );
  }

  // ✅ Mark a single notification as unread
  markAsUnRead(notificationId: number): Observable<NotificationResponse> {
    return this.http.put(`${this.baseURL}/${this.subUrl}/mark-as-unread/${notificationId}`, {}).pipe(
      map(response => this.mapToNotificationResponse(response))
    );
  }

  // ✅ Mark all notifications as read
  markAllAsRead(user_id: number): Observable<NotificationResponse> {
    return this.http.put(`${this.baseURL}/${this.subUrl}/mark-all-as-read/` + user_id, {}).pipe(
      map((response: any) => {
        const notifcationResponse: NotificationResponse = this.mapToNotificationResponse(response)


        if (notifcationResponse.success && notifcationResponse.notifications) {
          notifcationResponse.notifications.forEach(loopedNotification => {
            // loopedNotification.is_read = true;

            const current = this.allActiveUserNotifications.getValue();
            const updated = current.map(notification => {
              if (notification.id === loopedNotification.id) {
                return loopedNotification;
              } else {
                return notification;
              }
            });
            this.updateUserNotificationData(updated);
          });
        }


        return notifcationResponse;
      })
    );
  }

  // ✅ Delete a notification
  deleteNotification(notificationId: number): Observable<NotificationResponse> {
    return this.http.delete(`${this.baseURL}/${this.subUrl}/delete-notification/${notificationId}`).pipe(
      map(response => this.mapToNotificationResponse(response))
    );
  }






}