import { EntityStatus } from "./enum.interface";
import { BaseResponse } from "./shared.interface";


// 1. The Core Data Transfer Object (DTO)
export interface ApplicationNoteDTO {
  id: number;
  user_id: number;
  visa_application_id: number;
  content: string;
  
  entity_status?: EntityStatus;
  date_created?: string; // Standard ISO date string from Python datetime
  date_updated?: string;
  
  // Optional: If you eventually return the user object to display the reviewer's name/avatar
  // user?: UserDTO; 
}

// 2. Payload for POST /application_notes/create-note
export interface ApplicationNoteCreateRequest {
  user_id: number;
  visa_application_id: number;
  content: string;
}

// 3. Payload for PUT /application_notes/update-note/{note_id}
export interface ApplicationNoteUpdateRequest {
  content: string;
}

// 4. The Standardized API Response
export interface ApplicationNoteResponse extends BaseResponse{
  application_note?: ApplicationNoteDTO;
  application_notes?: ApplicationNoteDTO[];
}