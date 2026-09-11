import { EntityStatus, NotificationStatus, NotificationType } from "./enum.interface";
import { BaseResponse } from "./shared.interface";


export interface NotificationDTO {
  id: number;
  user_id: number;
  claim_id?: number;
  policy_id?: number;
  notification_type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  related_id?: number;
  is_read: boolean;
  read_at?: Date;
  date_created: Date;
  date_updated?: Date;
  entity_status: EntityStatus;
}


export interface NotificationCreate {
  user_id: number;
  claim_id?: number;
  notification_type: NotificationType;
  title: string;
  message: string;
  related_id?: number;
}


export interface NotificationUpdate {
  id?: number;
  user_id?: number;
  type?: NotificationType;
  title?: string;
  message?: string;
  related_id?: number;
  is_read?: boolean;
}


export interface MarkBulkAsReadRequest{
    user_id: number
    notification_ids: number[]}


export interface NotificationResponse extends BaseResponse {
  notification?: NotificationDTO;
  notifications?: NotificationDTO[];
}