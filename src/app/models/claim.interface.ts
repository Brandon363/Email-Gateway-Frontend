import { ClaimStatus, EntityStatus } from "./enum.interface";
import { BaseResponse } from "./shared.interface";

export interface ClaimDTO {
  id: number;
  claim_number: string;
  policy_id: number;
  user_id: number;
  type: string;
  status: ClaimStatus;
  description: string;
  incident_date: Date;
  amount: number;
  documents?: string[];
  notes?: string;
  approved_amount?: number;
  date_created: Date;
  date_updated: Date;
  entity_status: EntityStatus;
}

export interface ClaimCreate {
  id?: number;
  claim_number?: string;
  policy_id?: number;
  user_id?: number;
  type?: string;
  status?: ClaimStatus;
  description?: string;
  incident_date?: Date;
  amount?: number;
  documents?: string[];
  notes?: string;
}

export interface ClaimUpdate {
  id: number;
  claim_number?: string;
  policy_id?: number;
  user_id?: number;
  type?: string;
  status?: ClaimStatus;
  description?: string;
  incident_date?: Date;
  amount?: number;
  documents?: string[];
  notes?: string;
  approved_amount?: number;
}

export interface ClaimApprovalRequest {
  user_id: number;
//   status: ClaimStatus;
}

export interface ClaimResponse extends BaseResponse {
  claim?: ClaimDTO;
  claims?: ClaimDTO[];
}