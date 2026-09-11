import { BaseResponse } from "./shared.interface";

export interface ExtractedDependentDTO {
  id: number;
  extracted_application_id?: number;
  dependant_id?: number;
  full_name?: string;
  full_name_confidence?: number;
  id_number?: string;
  id_number_confidence?: number;
  date_of_birth?: Date;
  date_of_birth_confidence?: number;
  age?: number;
  age_confidence?: number;
  gender?: string;
  gender_confidence?: number;
  client_relationship?: string;
  client_relationship_confidence?: number;
  entity_status?: string;
  date_created?: Date;
  date_updated?: Date;
}

export interface ExtractedDependentCreateRequest {
  extracted_application_id?: number;
  dependant_id?: number;
  full_name?: string;
  full_name_confidence?: number;
  id_number?: string;
  id_number_confidence?: number;
  date_of_birth?: Date;
  date_of_birth_confidence?: number;
  age?: number;
  age_confidence?: number;
  gender?: string;
  gender_confidence?: number;
  client_relationship?: string;
  client_relationship_confidence?: number;
}

export interface ExtractedDependentUpdateRequest {
  extracted_application_id?: number;
  dependant_id?: number;
  full_name?: string;
  full_name_confidence?: number;
  id_number?: string;
  id_number_confidence?: number;
  date_of_birth?: Date;
  date_of_birth_confidence?: number;
  age?: number;
  age_confidence?: number;
  gender?: string;
  gender_confidence?: number;
  client_relationship?: string;
  client_relationship_confidence?: number;
  entity_status?: string;
}

export interface extracted_dependent_response extends BaseResponse {
  extracted_dependent?: ExtractedDependentDTO;
  extracted_dependents?: ExtractedDependentDTO[];
}