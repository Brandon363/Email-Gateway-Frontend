import { EntityStatus, UserRole, VerificationStatus } from "./enum.interface";
import { ExtractedUserDTO } from "./extracted_user.interface";
import { BaseResponse } from "./shared.interface";

export interface UserDTO {
  id: number;
  id_number: string;
  email: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  user_role: UserRole;
  date_of_birth: Date;
  village_of_origin: string;
  place_of_birth: string;
  phone_number?: string;
  address?: string;
  is_logged_in: boolean;
  verification_notes?: string;
  verification_status: VerificationStatus;
  extracted_users?: ExtractedUserDTO[];
  date_last_logged_in?: Date;
  date_created: Date;
  date_updated?: Date;
  entity_status: EntityStatus;
  must_change_password?: boolean;
}

export interface TokenData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_role: UserRole;
//   is_logged_in: boolean;
  date_created: Date;
  date_updated?: Date;
  entity_status: EntityStatus;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  user_role?: UserRole | string;
  id_number?: string;
  other_names?: string;
  date_of_birth?: Date;
  village_of_origin?: string;
  place_of_birth?: string;
  phone_number?: string;
  address?: string;
}

export interface UserUpdateRequest {
  id: number;
  id_number?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  // user_role?: UserRole;
  other_names?: string;
  phone_number?: string;
  address?: string;
  date_of_birth?: Date;
  village_of_origin?: string;
  place_of_birth?: string;
  is_logged_in?: boolean;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserVerifificationRequest {
  user_id: number;
  verifier_id: number;
  verification_notes?: string | null;
}

export interface UserPasswordUpdate {
  oldPassword: string;
  newPassword: string;
}

export interface UserResponse extends BaseResponse {
  user?: UserDTO;
  users?: UserDTO[];
  token?: string;
  token_type?: string;
}