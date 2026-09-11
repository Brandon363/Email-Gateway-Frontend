import { EntityStatus } from "./enum.interface";
import { DocumentDTO } from "./document.interface";
import { BaseResponse } from "./shared.interface";

export interface ParticipantDTO {
  id?: number;
  attendance_register_id?: number;
  row_number?: number;
  first_name?: string;
  surname?: string;
  date_of_birth?: string;
  business_name?: string;
  village_name?: string;
  age?: string;
  gender?: string;
  ethnic_group?: string;
  contact_number?: string;
  signature?: string;
  entity_status?: EntityStatus;
  date_created?: string;
  date_updated?: string;
}

export interface AttendanceRegisterDTO {
  id: number;
  user_id?: number;

  attendance_register_title?: string;
  incubator_name?: string;
  workshop_name?: string;
  session_number?: string;
  facilitator_name?: string;
  facilitator_signature?: string;
  venue?: string;
  municipality?: string;
  date?: string;
  province?: string;
  area_type?: string;
  total_participants?: number;

  entity_status?: EntityStatus;
  date_created?: string;
  date_updated?: string;

  participants?: ParticipantDTO[];
  documents?: DocumentDTO[];
}

export interface AttendanceRegisterCreateRequest {
  user_id?: number;
  attendance_register_title?: string;
  incubator_name?: string;
  workshop_name?: string;
  session_number?: string;
  facilitator_name?: string;
  facilitator_signature?: string;
  venue?: string;
  municipality?: string;
  date?: string;
  province?: string;
  area_type?: string;
  total_participants?: number;
  participants?: ParticipantDTO[];
}

export interface AttendanceRegisterUpdateRequest extends AttendanceRegisterCreateRequest {
  id?: number;
  entity_status?: EntityStatus;
}

export interface AttendanceRegisterResponse extends BaseResponse {
  attendance_register?: AttendanceRegisterDTO;
  attendance_registers?: AttendanceRegisterDTO[];
}
