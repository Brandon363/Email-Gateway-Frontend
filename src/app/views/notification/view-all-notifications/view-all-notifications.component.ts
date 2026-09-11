import { ChangeDetectorRef, Component } from '@angular/core';
import { SharedModules } from '../../shared/shared_modules';
import { Subscription } from 'rxjs';
import { MarkBulkAsReadRequest, NotificationDTO } from '../../../models/notification.interface';
import { NotificationType } from '../../../models/enum.interface';
import { UserDTO } from '../../../models/user.interface';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-view-all-notifications',
  imports: [SharedModules],
  templateUrl: './view-all-notifications.component.html',
  styleUrl: './view-all-notifications.component.scss'
})
export class ViewAllNotificationsComponent {
private streamSubscription: Subscription | null = null;
  private getAllSubscription: Subscription | null = null;
  private retrieveAllSubscription: Subscription | null = null;
  private deleteSubscription: Subscription | null = null;
  private markAsReadSubscription: Subscription | null = null;

  // userId!: number;
  allNotifications: NotificationDTO[] = []
  allUnreadNotifications: NotificationDTO[] = []
  selectedNotifications = []

  groupedNotifications: { [key: string]: NotificationDTO[] } = {};;
  NotificationType = NotificationType

  value: any = "0";

  user!: UserDTO;



  constructor(
    public notificationService: NotificationService,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }





  getTabClass(tabValue: string) {
    console.log("hhehe", tabValue)
    return {
      'bg-primary text-white': this.value === tabValue,
      'surface-50  text-black': this.value !== tabValue
    }
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser()
    // this.getAllSubscription = this.notificationService.getAllNotificationsByUserId(this.userId).subscribe();
    if(this.notificationService.allActiveUserNotifications.value.length === 0){
      this.getAllSubscription = this.notificationService.getAllNotificationsByUserId(this.authService.getCurrentUser().id).subscribe();
    }
    this.retrieveAllSubscription = this.notificationService.allActiveUserNotifications.subscribe((response) => {
      if (response) {
        this.allNotifications = response
        this.allUnreadNotifications = response.filter((notification) => !this.isNotificationRead(notification))
        this.groupedNotifications = this.groupNotifications(response)
        
        
        // console.log(this.groupedNotifications[NotificationType.PROPOSAL_COLLABORATOR])
      }
      
    })
    this.markAllAsRead()
    

    // this.streamSubscription = this.notificationService.connect().subscribe({
    //   next: (data) => {
    //     this.notificationService.updateUserNotificationData(data)
    //   },
    // });
  }

  isNotificationRead(notification: NotificationDTO): boolean{
    return notification.is_read;
  }

  getNotificationCount(group: string) {
    return this.groupedNotifications[group]?.length || 0;
  }

  getNotificationDetails(notification: NotificationDTO): { title: string, icon: string, iconColor: string, link: string } {
    return this.sharedService.getNotificationDetails(notification) 
  }

  ngOnDestroy(): void {
    this.streamSubscription?.unsubscribe();
    this.retrieveAllSubscription?.unsubscribe();
    this.getAllSubscription?.unsubscribe();
    // this.markAllAsRead()
  }

  openNotificationSource(notification: NotificationDTO) {
    return this.sharedService.openNotificationSource(notification)
  }

  getTimeAgo(date: string): string {
    return moment.utc(date).local().fromNow();
    
  }


  groupNotifications(notifications: NotificationDTO[]) {
    const groupedNotifications: { [key: string]: NotificationDTO[] } = {
      [NotificationType.ANNOUNCEMENT]: [],
      [NotificationType.CLAIM_UPDATE]: [],
      [NotificationType.PAYMENT_UPDATE]: [],
      [NotificationType.POLICY_UPDATE]: [],
      [NotificationType.USER_UPDATE]: []
    };

    notifications.forEach(notification => {
      switch (notification.notification_type) {
        case NotificationType.ANNOUNCEMENT:
          groupedNotifications[NotificationType.ANNOUNCEMENT].push(notification);
          break;
        case NotificationType.CLAIM_UPDATE:
          groupedNotifications[NotificationType.CLAIM_UPDATE].push(notification);
          break;  
        case NotificationType.PAYMENT_UPDATE:
          groupedNotifications[NotificationType.PAYMENT_UPDATE].push(notification);
          break;
        case NotificationType.POLICY_UPDATE:
          groupedNotifications[NotificationType.POLICY_UPDATE].push(notification);
          break;
        case NotificationType.USER_UPDATE:
          groupedNotifications[NotificationType.USER_UPDATE].push(notification);
          break; 
      }
    });

    // Remove empty groups
    Object.keys(groupedNotifications).forEach(key => {
      if (groupedNotifications[key].length === 0) {
        delete groupedNotifications[key];
      }
    });

    return groupedNotifications;
  }

  markAllAsRead() {
    //  const mark_bulk_as_read_request: MarkBulkAsReadRequest = {
    //   user_id: this.authService.getCurrentUser().id,
    //   notification_ids: this.allNotifications.map(notification => notification.id)}
    this.markAsReadSubscription = this.notificationService.markAllAsRead(this.authService.getCurrentUser().id).subscribe();
  }

  
}