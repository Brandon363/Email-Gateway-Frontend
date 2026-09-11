import { EntityStatus } from "./enum.interface";
import { AttendanceRegisterDTO, ParticipantDTO } from "./attendance-register.interface";
import { BaseResponse } from "./shared.interface";

export interface ExtractedAttendanceRegisterDTO {
  id: number;
  attendance_register_id: number;
  overall_confidence_score?: number;
  date_created: string;
  date_updated?: string;
  entity_status: EntityStatus;

  attendance_register_title?: string;
  attendance_register_title_confidence?: number;
  attendance_register_title_bounding_box?: any;
  attendance_register_title_page?: number;

  incubator_name?: string;
  incubator_name_confidence?: number;
  incubator_name_bounding_box?: any;
  incubator_name_page?: number;

  workshop_name?: string;
  workshop_name_confidence?: number;
  workshop_name_bounding_box?: any;
  workshop_name_page?: number;

  session_number?: string;
  session_number_confidence?: number;
  session_number_bounding_box?: any;
  session_number_page?: number;

  facilitator_name?: string;
  facilitator_name_confidence?: number;
  facilitator_name_bounding_box?: any;
  facilitator_name_page?: number;

  facilitator_signature?: string;
  facilitator_signature_confidence?: number;
  facilitator_signature_bounding_box?: any;
  facilitator_signature_page?: number;

  venue?: string;
  venue_confidence?: number;
  venue_bounding_box?: any;
  venue_page?: number;

  municipality?: string;
  municipality_confidence?: number;
  municipality_bounding_box?: any;
  municipality_page?: number;

  date?: string;
  date_confidence?: number;
  date_bounding_box?: any;
  date_page?: number;

  province?: string;
  province_confidence?: number;
  province_bounding_box?: any;
  province_page?: number;

  area_type?: string;
  area_type_confidence?: number;
  area_type_bounding_box?: any;
  area_type_page?: number;

  participants_json?: ParticipantDTO[];
  attendance_register?: AttendanceRegisterDTO;
}

export interface ExtractedAttendanceRegisterResponse extends BaseResponse {
  extracted_attendance_register?: ExtractedAttendanceRegisterDTO;
  extracted_attendance_registers?: ExtractedAttendanceRegisterDTO[];
}
