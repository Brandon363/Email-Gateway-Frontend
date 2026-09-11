// extracted-visa-application.model.ts

import { EntityStatus } from "./enum.interface";
import { BaseResponse } from "./shared.interface";

export interface ExtractedVisaApplicationDTO {

  overall_confidence_score?: number;
  application_id: number;
  id: number;

  // ==========================================
  // 1. Personal Information
  // ==========================================
  title?: string;
  title_confidence?: number;
  title_bounding_box?: number[];
  title_page?: number;

  surname?: string;
  surname_confidence?: number;
  surname_bounding_box?: number[];
  surname_page?: number;

  first_names?: string;
  first_names_confidence?: number;
  first_names_bounding_box?: number[];
  first_names_page?: number;

  sex?: string;
  sex_confidence?: number;
  sex_bounding_box?: number[];
  sex_page?: number;

  date_of_birth?: string; // ISO date string from backend
  date_of_birth_confidence?: number;
  date_of_birth_bounding_box?: number[];
  date_of_birth_page?: number;

  place_of_birth?: string;
  place_of_birth_confidence?: number;
  place_of_birth_bounding_box?: number[];
  place_of_birth_page?: number;

  present_nationality?: string;
  present_nationality_confidence?: number;
  present_nationality_bounding_box?: number[];
  present_nationality_page?: number;

  previous_nationality?: string;
  previous_nationality_confidence?: number;
  previous_nationality_bounding_box?: number[];
  previous_nationality_page?: number;

  // ==========================================
  // 2. Passport Details
  // ==========================================
  passport_number?: string;
  passport_number_confidence?: number;
  passport_number_bounding_box?: number[];
  passport_number_page?: number;

  place_of_issue?: string;
  place_of_issue_confidence?: number;
  place_of_issue_bounding_box?: number[];
  place_of_issue_page?: number;

  date_of_issue?: string;
  date_of_issue_confidence?: number;
  date_of_issue_bounding_box?: number[];
  date_of_issue_page?: number;

  date_of_expiry?: string;
  date_of_expiry_confidence?: number;
  date_of_expiry_bounding_box?: number[];
  date_of_expiry_page?: number;

  // ==========================================
  // 3. Travel Logistics
  // ==========================================
  occupation?: string;
  occupation_confidence?: number;
  occupation_bounding_box?: number[];
  occupation_page?: number;

  purpose_of_visit?: string;
  purpose_of_visit_confidence?: number;
  purpose_of_visit_bounding_box?: number[];
  purpose_of_visit_page?: number;

  residential_address?: string;
  residential_address_confidence?: number;
  residential_address_bounding_box?: number[];
  residential_address_page?: number;

  proposed_address_in_zim?: string;
  proposed_address_in_zim_confidence?: number;
  proposed_address_in_zim_bounding_box?: number[];
  proposed_address_in_zim_page?: number;

  period_start?: string;
  period_start_confidence?: number;
  period_start_bounding_box?: number[];
  period_start_page?: number;

  period_end?: string;
  period_end_confidence?: number;
  period_end_bounding_box?: number[];
  period_end_page?: number;

  // ==========================================
  // 4. Spouse
  // ==========================================
  spouse_surname?: string;
  spouse_surname_confidence?: number;
  spouse_surname_bounding_box?: number[];
  spouse_surname_page?: number;

  spouse_first_names?: string;
  spouse_first_names_confidence?: number;
  spouse_first_names_bounding_box?: number[];
  spouse_first_names_page?: number;

  spouse_date_of_birth?: string;
  spouse_date_of_birth_confidence?: number;
  spouse_date_of_birth_bounding_box?: number[];
  spouse_date_of_birth_page?: number;

  spouse_place_of_birth?: string;
  spouse_place_of_birth_confidence?: number;
  spouse_place_of_birth_bounding_box?: number[];
  spouse_place_of_birth_page?: number;

  // ==========================================
  // 5. Children (1–5)
  // ==========================================
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

  overall_accuracy?: number;


  entity_status?: EntityStatus;
  date_created?: string;
  date_updated?: string;
}


export interface ChildTableRow {
  index: number;
  full_names: string;
  full_names_confidence: number;
  place_of_birth: string;
  place_of_birth_confidence: number;
  dob: string;
  dob_confidence: number;
  passport: string;
  passport_confidence: number;
}


export interface ExtractedVisaApplicationResponse extends BaseResponse {
  extracted_visa_application?: ExtractedVisaApplicationDTO;
  extracted_visa_applications?: ExtractedVisaApplicationDTO[];
}
