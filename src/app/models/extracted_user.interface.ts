import { EntityStatus } from "./enum.interface";
import { BaseResponse } from "./shared.interface";

export interface ExtractedUserDTO {
  id: number;
  user_id: number;
  id_number?: string;
  id_number_confidence?: number;
  first_name?: string;
  first_name_confidence?: number;
  other_names?: string;
  other_names_confidence?: number;
  last_name?: string;
  last_name_confidence?: number;
  village_of_origin?: string;
  village_of_origin_confidence?: number;
  place_of_birth?: string;
  place_of_birth_confidence?: number;
  address?: string;
  address_confidence?: number;
  date_of_birth?: Date;
  date_of_birth_confidence?: number;
  overall_accuracy?: number;
  date_created?: Date;
  date_updated?: Date;
  entity_status: EntityStatus;
}

export interface ExtractedUserCreateRequest {
  user_id: number;
  id_number?: string;
  id_number_confidence?: number;
  first_name?: string;
  first_name_confidence?: number;
  other_names?: string;
  other_names_confidence?: number;
  last_name?: string;
  last_name_confidence?: number;
  village_of_origin?: string;
  village_of_origin_confidence?: number;
  place_of_birth?: string;
  place_of_birth_confidence?: number;
  address?: string;
  address_confidence?: number;
  overall_accuracy?: number;
  date_of_birth?: Date;
  date_of_birth_confidence?: number;
}

export interface ExtractedUserUpdateRequest {
  id: number;
  user_id?: number;
  id_number?: string;
  id_number_confidence?: number;
  first_name?: string;
  first_name_confidence?: number;
  other_names?: string;
  other_names_confidence?: number;
  last_name?: string;
  last_name_confidence?: number;
  village_of_origin?: string;
  village_of_origin_confidence?: number;
  place_of_birth?: string;
  place_of_birth_confidence?: number;
  address?: string;
  address_confidence?: number;
  date_of_birth?: Date;
  date_of_birth_confidence?: number;
  overall_accuracy?: number;
  entity_status?: EntityStatus;
}

export interface ExtractedUserResponse extends BaseResponse{
  extracted_user?: ExtractedUserDTO;
  extracted_users?: ExtractedUserDTO[];
}