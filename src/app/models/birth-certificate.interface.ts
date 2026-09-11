import { EntityStatus } from "./enum.interface";
import { ExtractedBirthCertificateDTO } from "./extracted-birth-certificate.interface";
import { DocumentDTO } from "./document.interface";
import { BaseResponse } from "./shared.interface";

export interface AuditTrailUserDTO {
  id: number;
  first_name: string;
  last_name: string;
}

export interface BirthCertificateAuditTrailDTO {
  id: number;
  birth_certificate_id: number;
  edited_by_id?: number;
  field_name: string;
  field_key?: string;
  old_value?: string;
  new_value?: string;
  date_created?: string;
  edited_by?: AuditTrailUserDTO;
}

export interface BirthCertificateAuditTrailResponse extends BaseResponse {
  audit_trails?: BirthCertificateAuditTrailDTO[];
}

export interface BirthCertificateDTO {
  id: number;
  user_id?: number;

  certificate_number?: string;
  district?: string;
  birth_entry_number?: string;

  child_id_number?: string;
  child_first_names?: string;
  child_surname?: string;
  child_birth_place?: string;
  child_date_of_birth?: string;
  child_sex?: string;

  father_first_names?: string;
  father_surname?: string;
  father_birth_place?: string;
  father_id_number?: string;

  mother_first_names?: string;
  mother_maiden_surname?: string;
  mother_birth_place?: string;
  mother_id_number?: string;

  informant_signature_or_mark?: string;
  informant_qualification?: string;
  informant_address?: string;

  date_of_registration?: string;
  registrar_name?: string;
  birth_storage?: string;
  issue_date?: string;

  entity_status?: EntityStatus;
  date_created?: string;
  date_updated?: string;

  extracted_certificates?: ExtractedBirthCertificateDTO[];
  documents?: DocumentDTO[];
  audit_trails?: BirthCertificateAuditTrailDTO[];
}

export interface BirthCertificateCreateRequest {
  user_id?: number;

  certificate_number?: string;
  district?: string;
  birth_entry_number?: string;

  child_id_number?: string;
  child_first_names?: string;
  child_surname?: string;
  child_birth_place?: string;
  child_date_of_birth?: string;
  child_sex?: string;

  father_first_names?: string;
  father_surname?: string;
  father_birth_place?: string;
  father_id_number?: string;

  mother_first_names?: string;
  mother_maiden_surname?: string;
  mother_birth_place?: string;
  mother_id_number?: string;

  informant_signature_or_mark?: string;
  informant_qualification?: string;
  informant_address?: string;

  date_of_registration?: string;
  registrar_name?: string;
  birth_storage?: string;
  issue_date?: string;
}

export interface BirthCertificateUpdateRequest extends BirthCertificateCreateRequest {
  id?: number;
  entity_status?: EntityStatus;
  edited_by_id?: number;  // ID of the user performing the edit — for audit trail
}

export interface BirthCertificateResponse extends BaseResponse {
  birth_certificate?: BirthCertificateDTO;
  birth_certificates?: BirthCertificateDTO[];
}

