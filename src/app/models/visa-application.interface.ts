import { ApplicationNoteDTO } from "./application_note.interface";
import { ApplicationTrackingDTO } from "./application_tracking.interface";
import { DocumentDTO } from "./document.interface";
import { ApplicationStatus, EntityStatus } from "./enum.interface";
import { ExtractedVisaApplicationDTO } from "./extracted-visa-application.interface";
import { BaseResponse } from "./shared.interface";

export interface VisaApplicationDTO {
  id: number;
  user_id?: number;

  // --- Personal Information ---
  title?: string;
  surname?: string;
  first_names?: string;
  sex?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  present_nationality?: string;
  previous_nationality?: string;

  // --- Passport Details ---
  passport_number?: string;
  place_of_issue?: string;
  date_of_issue?: string;
  date_of_expiry?: string;

  // --- Travel Logistics ---
  occupation?: string;
  purpose_of_visit?: string;
  residential_address?: string;
  proposed_address_in_zim?: string;
  period_start?: string;
  period_end?: string;

  // --- Spouse ---
  spouse_surname?: string;
  spouse_first_names?: string;
  spouse_date_of_birth?: string;
  spouse_place_of_birth?: string;

  // --- Children ---
  child_1_full_names?: string;
  child_1_place_of_birth?: string;
  child_1_dob?: string;
  child_1_passport?: string;

  child_2_full_names?: string;
  child_2_place_of_birth?: string;
  child_2_dob?: string;
  child_2_passport?: string;

  child_3_full_names?: string;
  child_3_place_of_birth?: string;
  child_3_dob?: string;
  child_3_passport?: string;

  child_4_full_names?: string;
  child_4_place_of_birth?: string;
  child_4_dob?: string;
  child_4_passport?: string;

  child_5_full_names?: string;
  child_5_place_of_birth?: string;
  child_5_dob?: string;
  child_5_passport?: string;

  // --- State ---
  status: ApplicationStatus;
  entity_status?: EntityStatus;
  date_created?: string;
  date_updated?: string;

  // --- Relationships ---
  extracted_applications?: ExtractedVisaApplicationDTO[];
  application_tracking_stages?: ApplicationTrackingDTO[];
  documents?: DocumentDTO[];
  application_notes?: ApplicationNoteDTO[];
}


export interface VisaApplicationCreateRequest {
  user_id?: number;

  title?: string;
  surname?: string;
  first_names?: string;
  sex?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  present_nationality?: string;
  previous_nationality?: string;

  passport_number?: string;
  place_of_issue?: string;
  date_of_issue?: string;
  date_of_expiry?: string;

  occupation?: string;
  purpose_of_visit?: string;
  residential_address?: string;
  proposed_address_in_zim?: string;
  period_start?: string;
  period_end?: string;

  spouse_surname?: string;
  spouse_first_names?: string;
  spouse_date_of_birth?: string;
  spouse_place_of_birth?: string;

  child_1_full_names?: string;
  child_1_place_of_birth?: string;
  child_1_dob?: string;
  child_1_passport?: string;

  child_2_full_names?: string;
  child_2_place_of_birth?: string;
  child_2_dob?: string;
  child_2_passport?: string;

  child_3_full_names?: string;
  child_3_place_of_birth?: string;
  child_3_dob?: string;
  child_3_passport?: string;

  child_4_full_names?: string;
  child_4_place_of_birth?: string;
  child_4_dob?: string;
  child_4_passport?: string;

  child_5_full_names?: string;
  child_5_place_of_birth?: string;
  child_5_dob?: string;
  child_5_passport?: string;
}


export interface VisaApplicationUpdateRequest {
  id: number;
  user_id?: number;
  status?: ApplicationStatus;
  entity_status?: EntityStatus;

  title?: string;
  surname?: string;
  first_names?: string;
  sex?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  present_nationality?: string;
  previous_nationality?: string;

  passport_number?: string;
  place_of_issue?: string;
  date_of_issue?: string;
  date_of_expiry?: string;

  occupation?: string;
  purpose_of_visit?: string;
  residential_address?: string;
  proposed_address_in_zim?: string;
  period_start?: string;
  period_end?: string;

  spouse_surname?: string;
  spouse_first_names?: string;
  spouse_date_of_birth?: string;
  spouse_place_of_birth?: string;

  child_1_full_names?: string;
  child_1_place_of_birth?: string;
  child_1_dob?: string;
  child_1_passport?: string;

  child_2_full_names?: string;
  child_2_place_of_birth?: string;
  child_2_dob?: string;
  child_2_passport?: string;

  child_3_full_names?: string;
  child_3_place_of_birth?: string;
  child_3_dob?: string;
  child_3_passport?: string;

  child_4_full_names?: string;
  child_4_place_of_birth?: string;
  child_4_dob?: string;
  child_4_passport?: string;

  child_5_full_names?: string;
  child_5_place_of_birth?: string;
  child_5_dob?: string;
  child_5_passport?: string;
}


export interface VisaApplicationResponse extends BaseResponse{
  visa_application?: VisaApplicationDTO;
  visa_applications?: VisaApplicationDTO[];
}
