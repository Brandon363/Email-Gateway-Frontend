import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaiaRecord {
  id: number;
  reference_number: string;
  patient_full_name: string;
  patient_id_number: string | null;
  request_type: 'RAF' | 'MVA' | 'GENERAL';
  requesting_party: string | null;
  file_reference: string | null;
  date_received: string;
  statutory_deadline: string;
  days_remaining: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED' | 'OVERDUE' | 'ESCALATED' | 'CLOSED';
  assigned_officer_id: number | null;
  notes: string | null;
  date_created: string;
  date_updated: string;
}

export interface PaiaDetailRecord extends PaiaRecord {
  audit_trail: PaiaAuditEntry[];
}

export interface PaiaAuditEntry {
  id: number;
  previous_status: string | null;
  new_status: string;
  note: string | null;
  changed_by_id: number | null;
  date_changed: string;
}

export interface PaiaDashboardMetrics {
  total: number;
  open: number;
  in_progress: number;
  overdue: number;
  fulfilled: number;
  closed: number;
  escalated: number;
  closed_this_month: number;
  sla_compliance_pct: number;
  due_this_week: PaiaRecord[];
  type_breakdown: { RAF: number; MVA: number; GENERAL: number };
}

export interface CreatePaiaRequest {
  patient_full_name: string;
  date_received: string;
  request_type?: string;
  patient_id_number?: string;
  requesting_party?: string;
  file_reference?: string;
  assigned_officer_id?: number;
  notes?: string;
}

export interface PaiaAlertSettings {
  paia_alert_days: number;
  paia_alert_email: string;
  paia_alert_enabled: boolean;
  resend_configured?: boolean;
  sender_email?: string;
  date_updated?: string;
}

@Injectable({ providedIn: 'root' })
export class PaiaRequestService {
  private baseUrl = environment.baseUrl;
  private endpoint = 'paia';

  private allRecords$ = new BehaviorSubject<PaiaRecord[]>([]);
  public allRecords = this.allRecords$.asObservable();

  constructor(private http: HttpClient) {}

  /** Get dashboard KPI metrics. */
  getDashboardMetrics(): Observable<PaiaDashboardMetrics> {
    return this.http
      .get<any>(`${this.baseUrl}/${this.endpoint}/dashboard`)
      .pipe(map(res => res.metrics));
  }

  /** Create a new PAIA request. */
  createPaiaRequest(request: CreatePaiaRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.endpoint}`, request);
  }

  /** Get all PAIA requests with optional status/type filters. */
  getAllPaiaRequests(status?: string, type?: string): Observable<PaiaRecord[]> {
    let url = `${this.baseUrl}/${this.endpoint}`;
    const params: string[] = [];
    if (status) params.push(`status=${status}`);
    if (type) params.push(`type=${type}`);
    if (params.length) url += `?${params.join('&')}`;

    return this.http.get<any>(url).pipe(
      map(res => {
        const records = res.records || [];
        this.allRecords$.next(records);
        return records;
      })
    );
  }

  /** Get a single PAIA request with its audit trail. */
  getPaiaRequestById(id: number): Observable<PaiaDetailRecord> {
    return this.http
      .get<any>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(map(res => res.record));
  }

  /** Update the status of a PAIA request. */
  updateStatus(id: number, newStatus: string, note?: string, changedById?: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${this.endpoint}/${id}/status`, {
      new_status: newStatus,
      note,
      changed_by_id: changedById,
    });
  }

  /** Add a timestamped note to a PAIA request. */
  addNote(id: number, note: string, changedById?: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.endpoint}/${id}/notes`, {
      note,
      changed_by_id: changedById,
    });
  }

  /** Soft-delete a PAIA request. */
  deletePaiaRequest(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.endpoint}/${id}`);
  }

  /** Get PAIA due alert settings */
  getAlertSettings(): Observable<PaiaAlertSettings> {
    return this.http
      .get<any>(`${this.baseUrl}/settings/paia-alerts`)
      .pipe(map(res => res.settings));
  }

  /** Update PAIA due alert settings */
  updateAlertSettings(settings: {
    paia_alert_days: number;
    paia_alert_email: string;
    paia_alert_enabled: boolean;
  }): Observable<any> {
    return this.http.put(`${this.baseUrl}/settings/paia-alerts`, settings);
  }

  /** Trigger a test alert email via Resend */
  sendTestAlert(recipientEmail?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/settings/paia-alerts/test`, {
      recipient_email: recipientEmail || undefined,
    });
  }
}
