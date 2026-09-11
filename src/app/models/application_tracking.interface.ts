import { ApplicationStage, TrackingStatus } from "./enum.interface";
import { BaseResponse } from "./shared.interface";

export interface ApplicationTrackingDTO {
  id: number;
  application_id: number;
  stage: ApplicationStage;
  status: TrackingStatus;
  date_created: Date;
  // user_id: number;
  action_performed_by_id: number;
  notes?: string;
}

export interface ApplicationTrackingCreateRequest {
  application_id: number;
  stage: ApplicationStage;
  status: TrackingStatus;
  // user_id: number;
  action_performed_by_id: number;
  notes?: string;
}

export interface ApplicationTrackingUpdateRequest {
  id: number;
  application_id?: number;
  stage?: ApplicationStage;
  status?: TrackingStatus;
  // user_id?: number;
  action_performed_by_id?: number;
  notes?: string;
}

export interface ApplicationTrackingResponse extends BaseResponse {
  applicationTracking?: ApplicationTrackingDTO;
  applicationTrackings?: ApplicationTrackingDTO[];
}