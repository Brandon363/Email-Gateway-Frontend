import { EntityStatus, DocumentType } from "./enum.interface";
import { BaseResponse } from "./shared.interface";

export interface DocumentDTO {
  id: number;
  user_id: number;
  claim_id?: number;
  policy_id?: number;
  type: DocumentType;
  name: string;
  url: string;
  mime_type: string;
  size: number;
  date_created: Date;
  date_updated?: Date;
  entity_status: EntityStatus;
}

export interface DocumentCreate {
  user_id: number;
  claim_id?: number;
  policy_id?: number;
  type: DocumentType;
  name: string;
  url: string;
  mime_type: string;
  size: number;
}

export interface DocumentUpdate {
  user_id?: number;
  claim_id?: number;
  policy_id?: number;
  type?: DocumentType;
  name?: string;
  url?: string;
  mime_type?: string;
  size?: number;
}

export interface DocumentResponse extends BaseResponse {
  document?: DocumentDTO;
  documents?: DocumentDTO[];
}