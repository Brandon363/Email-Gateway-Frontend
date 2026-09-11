// ---------------------------------------------------------
// Enums (Must match backend exactly)
// ---------------------------------------------------------

import { BaseResponse } from "./shared.interface";

export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ValidationStatus {
  CLEAN = 'clean',
  WARNING = 'warning',
  DANGER = 'danger'
}


// ---------------------------------------------------------
// Models
// ---------------------------------------------------------

export interface ValidationFlag {
  code: string;
  severity: SeverityLevel;
  message: string;
  field?: string;   // Used for dynamic form highlighting
}

export interface ValidationResult extends BaseResponse {
  status: ValidationStatus;
  flags: ValidationFlag[];
}