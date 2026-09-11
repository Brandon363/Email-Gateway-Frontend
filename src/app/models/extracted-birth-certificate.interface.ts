import { EntityStatus } from "./enum.interface";
import { BaseResponse } from "./shared.interface";

export interface ExtractedBirthCertificateDTO {
  id?: number;
  birth_certificate_id?: number;
  overall_confidence_score?: number;

  certificate_number?: string;
  certificate_number_confidence?: number;
  certificate_number_bounding_box?: number[];
  certificate_number_page?: number;

  district?: string;
  district_confidence?: number;
  district_bounding_box?: number[];
  district_page?: number;

  birth_entry_number?: string;
  birth_entry_number_confidence?: number;
  birth_entry_number_bounding_box?: number[];
  birth_entry_number_page?: number;

  child_id_number?: string;
  child_id_number_confidence?: number;
  child_id_number_bounding_box?: number[];
  child_id_number_page?: number;

  child_first_names?: string;
  child_first_names_confidence?: number;
  child_first_names_bounding_box?: number[];
  child_first_names_page?: number;

  child_surname?: string;
  child_surname_confidence?: number;
  child_surname_bounding_box?: number[];
  child_surname_page?: number;

  child_birth_place?: string;
  child_birth_place_confidence?: number;
  child_birth_place_bounding_box?: number[];
  child_birth_place_page?: number;

  child_date_of_birth?: string;
  child_date_of_birth_confidence?: number;
  child_date_of_birth_bounding_box?: number[];
  child_date_of_birth_page?: number;

  child_sex?: string;
  child_sex_confidence?: number;
  child_sex_bounding_box?: number[];
  child_sex_page?: number;

  father_first_names?: string;
  father_first_names_confidence?: number;
  father_first_names_bounding_box?: number[];
  father_first_names_page?: number;

  father_surname?: string;
  father_surname_confidence?: number;
  father_surname_bounding_box?: number[];
  father_surname_page?: number;

  father_birth_place?: string;
  father_birth_place_confidence?: number;
  father_birth_place_bounding_box?: number[];
  father_birth_place_page?: number;

  father_id_number?: string;
  father_id_number_confidence?: number;
  father_id_number_bounding_box?: number[];
  father_id_number_page?: number;

  mother_first_names?: string;
  mother_first_names_confidence?: number;
  mother_first_names_bounding_box?: number[];
  mother_first_names_page?: number;

  mother_maiden_surname?: string;
  mother_maiden_surname_confidence?: number;
  mother_maiden_surname_bounding_box?: number[];
  mother_maiden_surname_page?: number;

  mother_birth_place?: string;
  mother_birth_place_confidence?: number;
  mother_birth_place_bounding_box?: number[];
  mother_birth_place_page?: number;

  mother_id_number?: string;
  mother_id_number_confidence?: number;
  mother_id_number_bounding_box?: number[];
  mother_id_number_page?: number;

  informant_signature_or_mark?: string;
  informant_signature_or_mark_confidence?: number;
  informant_signature_or_mark_bounding_box?: number[];
  informant_signature_or_mark_page?: number;

  informant_qualification?: string;
  informant_qualification_confidence?: number;
  informant_qualification_bounding_box?: number[];
  informant_qualification_page?: number;

  informant_address?: string;
  informant_address_confidence?: number;
  informant_address_bounding_box?: number[];
  informant_address_page?: number;

  date_of_registration?: string;
  date_of_registration_confidence?: number;
  date_of_registration_bounding_box?: number[];
  date_of_registration_page?: number;

  registrar_name?: string;
  registrar_name_confidence?: number;
  registrar_name_bounding_box?: number[];
  registrar_name_page?: number;

  birth_storage?: string;
  birth_storage_confidence?: number;
  birth_storage_bounding_box?: number[];
  birth_storage_page?: number;

  issue_date?: string;
  issue_date_confidence?: number;
  issue_date_bounding_box?: number[];
  issue_date_page?: number;

  entity_status?: EntityStatus;
  date_created?: string;
  date_updated?: string;
}

export interface ExtractedBirthCertificateResponse extends BaseResponse {
  extracted_birth_certificate?: ExtractedBirthCertificateDTO;
  extracted_birth_certificates?: ExtractedBirthCertificateDTO[];
}
