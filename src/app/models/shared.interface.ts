import { NotificationDTO } from "./notification.interface";

export interface BaseResponse {
  statusCode: number;
  success: boolean;
  message: string;
  errors?: ErrorDetail[] | null;
  notification?: NotificationDTO | null;
  notifications?: NotificationDTO[] | null;
}

export interface ErrorDetail {
  field: string;
  message: string;
}


export interface MenuDto {
  path: string;
  icon: string;
  text: string;
  buttonClass: string;
  tooltip: string;
  rippleColor: string;
  roles: Array<string>
}