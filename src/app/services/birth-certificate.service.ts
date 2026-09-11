import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BirthCertificateAuditTrailResponse, BirthCertificateDTO, BirthCertificateResponse, BirthCertificateUpdateRequest, BirthCertificateCreateRequest } from '../models/birth-certificate.interface';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BirthCertificateService {
  private baseURL = environment.baseUrl;
  private subUrl = 'birth_certificate';
  private allActiveCertificates = new BehaviorSubject<BirthCertificateDTO[]>([]);

  public selectedCertificate!: BirthCertificateDTO;

  constructor(private httpclient: HttpClient) { }

  mapToResponse(data: any): BirthCertificateResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      birth_certificate: data.birth_certificate || null,
      birth_certificates: data.birth_certificates || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }

  updateCertificateData(certificates: BirthCertificateDTO[] | BirthCertificateDTO) {
    if (Array.isArray(certificates)) {
      this.allActiveCertificates.next(certificates);
    } else {
      const current = this.allActiveCertificates.getValue();
      current.push(certificates);
      this.allActiveCertificates.next(current);
    }
  }

  retrieveCertificateData(): Observable<BirthCertificateDTO[]> {
    return this.allActiveCertificates.asObservable();
  }

  getAllActiveBirthCertificates(): Observable<BirthCertificateResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-all-birth-certificates`).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        if (res.success && res.birth_certificates) {
          this.updateCertificateData(res.birth_certificates);
        }
        return res;
      })
    );
  }

  getBirthCertificateById(id: number): Observable<BirthCertificateResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-birth-certificate-by-id/${id}`).pipe(
      map((response: any) => {
        return this.mapToResponse(response);
      })
    );
  }

  getBirthCertificatesByUserId(userId: number): Observable<BirthCertificateResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-birth-certificates-by-user-id/${userId}`).pipe(
      map((response: any) => {
        return this.mapToResponse(response);
      })
    );
  }

  createBirthCertificate(createRequest: BirthCertificateCreateRequest): Observable<BirthCertificateResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/create-birth-certificate`, createRequest).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        if (res.success && res.birth_certificate) {
          this.updateCertificateData(res.birth_certificate);
        }
        return res;
      })
    );
  }

  editBirthCertificate(id: number, updateRequest: BirthCertificateUpdateRequest): Observable<BirthCertificateResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/update-birth-certificate/${id}`, updateRequest).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        if (res.success && res.birth_certificate) {
          const current = this.allActiveCertificates.getValue();
          const updated = current.map((p: any) =>
            p.id === res.birth_certificate?.id ? res.birth_certificate : p
          );
          this.allActiveCertificates.next(updated);
        }
        return res;
      })
    );
  }

  deleteBirthCertificateById(id: number): Observable<BirthCertificateResponse> {
    return this.httpclient.delete(`${this.baseURL}/${this.subUrl}/delete-birth-certificate/${id}`).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        if (res.success && res.birth_certificate) {
          const current = this.allActiveCertificates.getValue();
          const updated = current.filter(p => p.id !== res.birth_certificate?.id);
          this.allActiveCertificates.next(updated);
        }
        return res;
      })
    );
  }

  getAuditTrail(birthCertificateId: number): Observable<BirthCertificateAuditTrailResponse> {
    return this.httpclient.get(
      `${this.baseURL}/birth_certificate_audit_trail/get-audit-trail/${birthCertificateId}`
    ).pipe(
      map((response: any) => ({
        success: response.success,
        statusCode: response.status_code,
        message: response.message,
        errors: response.errors || null,
        audit_trails: response.audit_trails || [],
        notifications: response.notifications || null,
        notification: response.notification || null,
      } as BirthCertificateAuditTrailResponse))
    );
  }
}
