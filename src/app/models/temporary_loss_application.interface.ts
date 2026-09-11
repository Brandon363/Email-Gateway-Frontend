import { ApplicationTrackingDTO } from "./application_tracking.interface";
import { DependentDTO, DependentUpdateRequest } from "./dependents.interface";
import { ApplicationStatus } from "./enum.interface";
import { ExtractedTemporaryLossApplicationDTO } from "./extracted_temporary_loss_application.interface";
import { BaseResponse } from "./shared.interface";

export interface TemporaryLossApplicationDTO {
  id: number;
  extracted_application_id: number;
  full_name?: string;
  id_number?: string;
  date_of_birth?: Date;
  contact_number?: string;
  email?: string;
  address?: string;
  nok_full_name?: string;
  nok_contact_number?: string;
  bank_name?: string;
  account_number?: string;
  branch_code?: string;
  existing_insurance_with_other_company?: string;
  existing_chronic_condition?: string;
  status?: ApplicationStatus;
  agent_full_name?: string;
  agent_number?: string;
  title?: string;
  gender?: string;
  b_date_of_birth?: Date;
  claim_ailment?: string;
  claim_amount?: string;
  declined_coverage?: boolean;
  declined_cover_reason?: string;
  extracted_applications?: ExtractedTemporaryLossApplicationDTO[];
  dependents?: DependentDTO[];
  application_tracking_stages?: ApplicationTrackingDTO[];
  date_created?: Date;
  date_updated?: Date;
}

export interface TemporaryLossApplicationCreateRequest {
  extracted_application_id?: number;
  full_name?: string;
  id_number?: string;
  date_of_birth?: Date;
  contact_number?: string;
  email?: string;
  address?: string;
  nok_full_name?: string;
  nok_contact_number?: string;
  bank_name?: string;
  account_number?: string;
  branch_code?: string;
  existing_insurance_with_other_company?: string;
  existing_chronic_condition?: string;
  agent_full_name?: string;
  agent_number?: string;
  title?: string;
  gender?: string;
  b_date_of_birth?: Date;
  claim_ailment?: string;
  claim_amount?: string;
  declined_coverage?: boolean;
  declined_cover_reason?: string;
}

export interface TemporaryLossApplicationUpdateRequest {
  id?: number;
  full_name?: string;
  id_number?: string;
  date_of_birth?: Date;
  contact_number?: string;
  email?: string;
  address?: string;
  nok_full_name?: string;
  nok_contact_number?: string;
  bank_name?: string;
  account_number?: string;
  branch_code?: string;
  existing_insurance_with_other_company?: string;
  existing_chronic_condition?: string;
  status?: ApplicationStatus;
  agent_full_name?: string;
  agent_number?: string;
  title?: string;
  gender?: string;
  b_date_of_birth?: Date;
  claim_ailment?: string;
  claim_amount?: string;
  declined_coverage?: boolean;
  declined_cover_reason?: string;
  dependents?: DependentUpdateRequest[];
}

export interface TemporaryLossApplicationResponse extends BaseResponse {
  temporaryLossApplication?: TemporaryLossApplicationDTO;
  temporaryLossApplications?: TemporaryLossApplicationDTO[];
}