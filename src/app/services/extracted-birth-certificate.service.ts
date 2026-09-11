import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ExtractedBirthCertificateDTO, ExtractedBirthCertificateResponse } from '../models/extracted-birth-certificate.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExtractedBirthCertificateService {
  private baseURL = environment.baseUrl;
  private subUrl = 'extracted_birth_certificate';
  private allActiveCertificates = new BehaviorSubject<ExtractedBirthCertificateDTO[]>([]);

  public selectedCertificate!: ExtractedBirthCertificateDTO;

  constructor(private httpclient: HttpClient) { }

  mapToResponse(data: any): ExtractedBirthCertificateResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      extracted_birth_certificate: data.extracted_birth_certificate || null,
      extracted_birth_certificates: data.extracted_birth_certificates || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }

  updateCertificateData(certificates: ExtractedBirthCertificateDTO[] | ExtractedBirthCertificateDTO) {
    if (Array.isArray(certificates)) {
      this.allActiveCertificates.next(certificates);
    } else {
      const current = this.allActiveCertificates.getValue();
      current.push(certificates);
      this.allActiveCertificates.next(current);
    }
  }

  retrieveCertificateData(): Observable<ExtractedBirthCertificateDTO[]> {
    return this.allActiveCertificates.asObservable();
  }

  extractBirthCertificate(files: FormData, user_id: number): Observable<ExtractedBirthCertificateResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/extract-birth-certificate/${user_id}`, files).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        return res;
      })
    );
  }

  getAllActiveExtractedBirthCertificates(): Observable<ExtractedBirthCertificateResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-all-extracted-birth-certificates`).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        if (res.success && res.extracted_birth_certificates) {
          this.updateCertificateData(res.extracted_birth_certificates);
        }
        return res;
      })
    );
  }

  getExtractedBirthCertificateById(id: number): Observable<ExtractedBirthCertificateResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-extracted-birth-certificate/${id}`).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        return res;
      })
    );
  }

  deleteExtractedBirthCertificateById(id: number): Observable<ExtractedBirthCertificateResponse> {
    return this.httpclient.delete(`${this.baseURL}/${this.subUrl}/delete-extracted-birth-certificate/${id}`).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        if (res.success && res.extracted_birth_certificate) {
          const current = this.allActiveCertificates.getValue();
          const updated = current.filter(p => p.id !== res.extracted_birth_certificate?.id);
          this.allActiveCertificates.next(updated);
        }
        return res;
      })
    );
  }
}
