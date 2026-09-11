import { Injectable } from '@angular/core';
import { NotificationType } from '../models/enum.interface';
import { NotificationDTO } from '../models/notification.interface';
import { Router } from '@angular/router';
import { UserDTO } from '../models/user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  getNotificationDetails(notification: NotificationDTO): { title: string, icon: string, iconColor: string, link: string } {
    switch (notification.notification_type) {
      case NotificationType.USER_UPDATE:
        return {
          title: notification.title || 'User Update',
          icon: "pi-user",
          iconColor: '#00c950',
          link: '/account'
        };
      case NotificationType.CLAIM_UPDATE:
        return {
          title: notification.title || 'Claim Update',
          icon: "pi-file",
          // iconColor: '#ff0000', 
          iconColor: '#fb2c36',
          link: '/claim/' + notification.claim_id
        };
      case NotificationType.POLICY_UPDATE:
        return {
          title: notification.title || 'Policy Update',
          icon: "pi-shield",
          iconColor: '#00bcff',
          link: '/policy/' + notification.policy_id
        };
      case NotificationType.ANNOUNCEMENT:
        return {
          title: notification.title || 'Announcement',
          icon: "pi-bullhorn",
          iconColor: '#00bcff',
          link: '/'
          // link: '/tenders'
        };
      default:
        return {
          title: 'New notification',
          icon: "pi-bell",
          iconColor: '',
          link: ''
        };
    }
  }

  openNotificationSource(notification: NotificationDTO) {
    const link = this.getNotificationDetails(notification).link
    // console.log(link)
    this.router.navigateByUrl(link)
  }


  getUserFromId(id: number, users: UserDTO[]): string {
    if (!users) {
      return '';
    }
    if (!id || id === null || id === undefined) {
      return '';
    }

    else {
      const u = users.find(user => user.id === id) as UserDTO;
      if (!u) {
        return '';
      }
      return u.first_name + ' ' + u.last_name;
    }

  }


  sanitizeFormValues<T>(data: T): T {
    const cleaned: any = { ...data };

    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === '') {
        cleaned[key] = null;
      }
    });

    return cleaned;
  }


  public downloadFile(url: string, filename: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        // 1. Create a URL for the blob
        const objectUrl = window.URL.createObjectURL(blob);
        
        // 2. Create an invisible anchor tag
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        link.style.display = 'none'; // Hidden
        
        // 3. Append, Click, Remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 4. Clean up the URL object
        window.URL.revokeObjectURL(objectUrl);
      },
      error: (err) => console.error('Download failed', err)
    });
  }
}
