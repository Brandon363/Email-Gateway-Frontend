import { BaseResponse } from "./shared.interface";

export interface DependentDTO {
  id: number;
  application_id: number;
  full_name: string;
  id_number: string;
  date_of_birth: Date;
  age: number;
  gender: string;
  client_relationship: string;
  date_created?: Date;
  date_updated?: Date;
}

export interface DependentCreateRequest {
  application_id: number;
  full_name: string;
  id_number: string;
  date_of_birth: Date;
  age: number;
  gender: string;
  client_relationship: string;
}

export interface DependentUpdateRequest {
  id: number;
  application_id?: number;
  full_name?: string;
  id_number?: string;
  date_of_birth?: Date;
  age?: number;
  gender?: string;
  client_relationship?: string;
}

export interface DependentResponse extends BaseResponse {
  dependent?: DependentDTO;
  dependents?: DependentDTO[];
}