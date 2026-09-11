import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LabourReport {
  id: number;
  original_filename: string;
  stored_filename?: string;
  processing_status: 'PENDING' | 'PROCESSING' | 'VALIDATED' | 'FAILED';
  facility_name: string;
  district: string;
  period_month: string;
  report_title?: string;
  misconduct_total: number;
  misconduct_finalized: number;
  misconduct_pending: number;
  grievance_total: number;
  grievance_finalized: number;
  grievance_pending: number;
  suspension_total: number;
  suspension_uplifted: number;
  suspension_outstanding: number;
  suspension_total_cost: number;
  appeals_total: number;
  disputes_conciliations: number;
  disputes_arbitrations: number;
  disputes_court: number;
  workplace_forum_functional: boolean;
  date_created: string;
}

export interface MisconductCase {
  id: number;
  report_id: number;
  row_index?: number;
  employee_name: string;
  date_received?: string;
  salary_level?: string;
  race?: string;
  gender?: string;
  nature_of_offence?: string;
  date_finalised?: string;
  status_of_case?: string;
  reason_not_finalised?: string;
  sanction?: string;
  is_suspended?: string;
  duration_of_suspension?: string;
  cost_of_suspension?: number;
  days_taken_to_finalise?: number;
  days_case_outstanding?: number;
  institution?: string;
  district?: string;
  period_month?: string;
}

export interface Grievance {
  id: number;
  report_id: number;
  row_index?: number;
  employee_name: string;
  date_received?: string;
  salary_level?: string;
  race?: string;
  gender?: string;
  nature_of_grievance?: string;
  date_finalised?: string;
  status_of_case?: string;
  reason_not_finalised?: string;
  days_taken_to_finalise?: number;
  days_case_outstanding?: number;
  institution?: string;
  district?: string;
  period_month?: string;
}

export interface PrecautionarySuspension {
  id: number;
  report_id: number;
  row_index?: number;
  employee_name: string;
  date_of_suspension?: string;
  race?: string;
  salary_level?: string;
  gender?: string;
  individual_cost_for_suspension?: number;
  duration_in_days?: number;
  reason_of_suspension?: string;
  type_of_transgression?: string;
  finding?: string;
  sanctions_imposed?: string;
  challenges_trends?: string;
  institution?: string;
  district?: string;
  period_month?: string;
}

export interface DisputeCase {
  id: number;
  report_id: number;
  dispute_type: 'APPEAL' | 'CONCILIATION' | 'ARBITRATION' | 'COURT';
  row_index?: number;
  employee_name: string;
  date_received?: string;
  salary_level?: string;
  race?: string;
  gender?: string;
  nature_of_dispute?: string;
  date_finalised?: string;
  status?: string;
  days_taken_to_finalise?: number;
  days_case_outstanding?: number;
  finding_outcome?: string;
  is_suspended?: string;
  duration_in_days?: number;
  challenges_trends?: string;
  institution?: string;
  district?: string;
  period_month?: string;
}

export interface LabourOverviewMetrics {
  total_reports: number;
  facilities_reporting: number;
  misconduct: {
    total: number;
    finalized: number;
    pending: number;
    resolution_rate: number;
    target: string;
  };
  grievances: {
    total: number;
    finalized: number;
    pending: number;
    resolution_rate: number;
    target: string;
  };
  suspensions: {
    total: number;
    uplifted: number;
    outstanding: number;
    total_cost: number;
  };
  disputes: {
    conciliations: number;
    arbitrations: number;
    court: number;
    appeals: number;
    total: number;
  };
  districts: string[];
  facilities: string[];
  periods: string[];
}

export interface PaginatedResult<T> {
  total: number;
  rows?: T[];
  reports?: T[];
  districts: string[];
  facilities: string[];
  periods: string[];
  total_cost?: number;
  avg_days?: number;
}

@Injectable({ providedIn: 'root' })
export class LabourRelationsService {
  private baseUrl = environment.baseUrl;
  private endpoint = 'labour-relations';

  constructor(private http: HttpClient) {}

  uploadReport(file: File, facilityName?: string, district?: string, periodMonth?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (facilityName) formData.append('facility_name', facilityName);
    if (district) formData.append('district', district);
    if (periodMonth) formData.append('period_month', periodMonth);

    return this.http.post(`${this.baseUrl}/${this.endpoint}/upload`, formData);
  }

  getOverview(): Observable<LabourOverviewMetrics> {
    return this.http.get<LabourOverviewMetrics>(`${this.baseUrl}/${this.endpoint}/overview`);
  }

  getMisconductCases(filters: {
    district?: string;
    facility_name?: string;
    status?: string;
    period_month?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Observable<PaginatedResult<MisconductCase>> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const val = (filters as any)[key];
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val);
      }
    });
    return this.http.get<PaginatedResult<MisconductCase>>(`${this.baseUrl}/${this.endpoint}/misconduct`, { params });
  }

  getGrievances(filters: {
    district?: string;
    facility_name?: string;
    status?: string;
    period_month?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Observable<PaginatedResult<Grievance>> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const val = (filters as any)[key];
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val);
      }
    });
    return this.http.get<PaginatedResult<Grievance>>(`${this.baseUrl}/${this.endpoint}/grievances`, { params });
  }

  createGrievance(data: Partial<Grievance>): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.endpoint}/grievances`, data);
  }

  getSuspensions(filters: {
    district?: string;
    facility_name?: string;
    period_month?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Observable<PaginatedResult<PrecautionarySuspension>> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const val = (filters as any)[key];
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val);
      }
    });
    return this.http.get<PaginatedResult<PrecautionarySuspension>>(`${this.baseUrl}/${this.endpoint}/suspensions`, { params });
  }

  getDisputes(filters: {
    dispute_type?: string;
    district?: string;
    facility_name?: string;
    status?: string;
    period_month?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Observable<PaginatedResult<DisputeCase>> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const val = (filters as any)[key];
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val);
      }
    });
    return this.http.get<PaginatedResult<DisputeCase>>(`${this.baseUrl}/${this.endpoint}/disputes`, { params });
  }

  getReports(filters: {
    district?: string;
    facility_name?: string;
    period_month?: string;
    discipline?: string;
    skip?: number;
    limit?: number;
  }): Observable<PaginatedResult<LabourReport>> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const val = (filters as any)[key];
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val);
      }
    });
    return this.http.get<PaginatedResult<LabourReport>>(`${this.baseUrl}/${this.endpoint}/reports`, { params });
  }

  getReportById(reportId: number): Observable<{
    report: LabourReport;
    misconduct_cases: MisconductCase[];
    grievances: Grievance[];
    suspensions: PrecautionarySuspension[];
    disputes: DisputeCase[];
  }> {
    return this.http.get<any>(`${this.baseUrl}/${this.endpoint}/reports/${reportId}`);
  }

  getReportFileUrl(reportId: number): string {
    return `${this.baseUrl}/${this.endpoint}/reports/${reportId}/file`;
  }

  getReportFileBlob(reportId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${this.endpoint}/reports/${reportId}/file`, { responseType: 'blob' });
  }

  updateReport(reportId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${this.endpoint}/reports/${reportId}`, data);
  }

  deleteReport(reportId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${this.endpoint}/reports/${reportId}`);
  }

  deleteGrievance(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${this.endpoint}/grievances/${id}`);
  }

  deleteMisconduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${this.endpoint}/misconduct/${id}`);
  }

  deleteSuspension(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${this.endpoint}/suspensions/${id}`);
  }

  deleteDispute(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${this.endpoint}/disputes/${id}`);
  }

  uploadIndividualDocument(file: File, discipline?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (discipline) {
      formData.append('discipline', discipline);
    }
    return this.http.post<any>(`${this.baseUrl}/${this.endpoint}/upload-individual-document`, formData);
  }
}


