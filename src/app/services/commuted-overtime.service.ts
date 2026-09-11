import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OvertimeRecord {
  id: number;
  original_filename: string;
  district: string | null;
  facility_name: string | null;
  period_month: string | null;
  processing_status: 'PENDING' | 'PROCESSING' | 'VALIDATED' | 'FAILED';
  total_rows_extracted: number;
  total_rows_flagged: number;
  overall_confidence_score?: number | null;
  model_id_used: string;
  date_created: string;
}

export interface OvertimeRow {
  id: number;
  row_index: number;
  employee_name: string | null;
  persal_number: string | null;
  designation: string | null;
  group_allocated: string | null;
  date: string | null;
  duty_roster_available: string | null;
  attendance_register_signed: string | null;
  hours_claimed: number | null;
  hours_approved?: number | null;
  amount_paid: string | null;
  variance: number | null;
  signature_present: boolean;
  supervisor_signature: string | null;
  doctor_signature: string | null;
  contract_period: string | null;
  confidence_score?: number | null;
  confidences?: { [field: string]: number } | null;
  is_flagged: boolean;
  flag_reason: string | null;
}

export interface OvertimeDetailResponse {
  success: boolean;
  record: OvertimeRecord & {
    validation_errors: any[];
    error_message: string | null;
  };
  rows: OvertimeRow[];
}

@Injectable({ providedIn: 'root' })
export class CommutedOvertimeService {
  private baseUrl = environment.baseUrl;
  private endpoint = 'overtime';

  private allRecords$ = new BehaviorSubject<OvertimeRecord[]>([]);
  public allRecords = this.allRecords$.asObservable();

  constructor(private http: HttpClient) {}

  /** Upload a commuted overtime PDF/Word file and trigger async extraction. */
  uploadOvertimeDocument(
    file: File,
    uploaderId: number,
    facilityName?: string,
    periodMonth?: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploader_id', uploaderId.toString());
    if (facilityName) formData.append('facility_name', facilityName);
    if (periodMonth) formData.append('period_month', periodMonth);

    return this.http.post(`${this.baseUrl}/${this.endpoint}/upload`, formData);
  }

  /** Get all overtime records. */
  getAllOvertimeRecords(): Observable<OvertimeRecord[]> {
    return this.http.get<any>(`${this.baseUrl}/${this.endpoint}`).pipe(
      map(res => {
        const records = res.records || [];
        this.allRecords$.next(records);
        return records;
      })
    );
  }

  /** Get a single overtime record with its extracted rows. */
  getOvertimeRecordById(id: number): Observable<OvertimeDetailResponse> {
    return this.http.get<OvertimeDetailResponse>(`${this.baseUrl}/${this.endpoint}/${id}`);
  }

  /** Get document file as blob for iframe/preview. */
  getDocumentFileBlob(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${this.endpoint}/${id}/file`, {
      responseType: 'blob'
    });
  }

  /** Update overtime record header and/or extracted rows. */
  updateOvertimeRecord(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${this.endpoint}/${id}`, data);
  }

  /** Soft-delete an overtime record. */
  deleteOvertimeRecord(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.endpoint}/${id}`);
  }

  /** Get consolidated master register across all digitized schedules with filters. */
  getConsolidatedRegister(filters?: {
    district?: string;
    facility_name?: string;
    period_month?: string;
    search?: string;
    status?: string;
  }): Observable<ConsolidatedRegisterResponse> {
    let params: any = {};
    if (filters) {
      if (filters.district && filters.district !== 'ALL') params.district = filters.district;
      if (filters.facility_name && filters.facility_name !== 'ALL') params.facility_name = filters.facility_name;
      if (filters.period_month && filters.period_month !== 'ALL') params.period_month = filters.period_month;
      if (filters.search) params.search = filters.search;
      if (filters.status && filters.status !== 'ALL') params.status = filters.status;
    }
    return this.http.get<ConsolidatedRegisterResponse>(`${this.baseUrl}/${this.endpoint}/register`, { params });
  }
}

export interface ConsolidatedOvertimeRow extends OvertimeRow {
  overtime_record_id: number;
  original_filename: string;
  district: string | null;
  facility_name: string | null;
  period_month: string | null;
  date_created: string;
}

export interface ConsolidatedRegisterResponse {
  success: boolean;
  count: number;
  filters: {
    districts: string[];
    facilities: string[];
    periods: string[];
  };
  summary: {
    total_rows: number;
    total_hours: number;
    clean_rows: number;
    flagged_rows: number;
    facilities_count: number;
  };
  rows: ConsolidatedOvertimeRow[];
}

