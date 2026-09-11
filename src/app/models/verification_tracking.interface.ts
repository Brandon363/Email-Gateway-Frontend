import { VerificationTrackingStage, TrackingStatus } from './enum.interface';
import { BaseResponse } from './shared.interface';

export interface VerificationTrackingDTO {
  id: number;
  stage: VerificationTrackingStage;
  status: TrackingStatus;
  date_created: Date;
  user_id: number;
  action_performed_by_id?: number;
  notes?: string;
}

export interface VerificationTrackingCreateRequest {
  stage: VerificationTrackingStage;
  status: TrackingStatus;
  user_id: number;
  action_performed_by_id?: number;
  notes?: string;
}

export interface VerificationTrackingUpdateRequest {
  id: number;
  stage?: VerificationTrackingStage;
  status?: TrackingStatus;
  user_id?: number;
  action_performed_by_id?: number;
  notes?: string;
}

export interface VerificationTrackingResponse extends BaseResponse {
  verificationTracking?: VerificationTrackingDTO;
  verificationTrackings?: VerificationTrackingDTO[];
}