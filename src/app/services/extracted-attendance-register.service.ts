import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ExtractedAttendanceRegisterDTO, ExtractedAttendanceRegisterResponse } from '../models/extracted-attendance-register.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExtractedAttendanceRegisterService {
  private baseURL = environment.baseUrl;
  private subUrl = 'extracted-attendance-registers';
  private allActiveRegisters = new BehaviorSubject<ExtractedAttendanceRegisterDTO[]>([]);

  public selectedRegister!: ExtractedAttendanceRegisterDTO;

  constructor(private httpclient: HttpClient) { }

  mapToResponse(data: any): ExtractedAttendanceRegisterResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      extracted_attendance_register: data.extracted_attendance_register || null,
      extracted_attendance_registers: data.extracted_attendance_registers || null,
    };
  }

  updateRegisterData(registers: ExtractedAttendanceRegisterDTO[] | ExtractedAttendanceRegisterDTO) {
    if (Array.isArray(registers)) {
      this.allActiveRegisters.next(registers);
    } else {
      const current = this.allActiveRegisters.getValue();
      current.push(registers);
      this.allActiveRegisters.next(current);
    }
  }

  retrieveRegisterData(): Observable<ExtractedAttendanceRegisterDTO[]> {
    return this.allActiveRegisters.asObservable();
  }

  extractAttendanceRegister(formData: FormData): Observable<ExtractedAttendanceRegisterResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/extract`, formData).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        if (res.success && res.extracted_attendance_register) {
          this.updateRegisterData(res.extracted_attendance_register);
        }
        return res;
      })
    );
  }

  getAllExtractedAttendanceRegisters(): Observable<ExtractedAttendanceRegisterResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/`).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        if (res.success && res.extracted_attendance_registers) {
          this.updateRegisterData(res.extracted_attendance_registers);
        }
        return res;
      })
    );
  }

  getExtractedAttendanceRegisterById(id: number): Observable<ExtractedAttendanceRegisterResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/${id}`).pipe(
      map((response: any) => this.mapToResponse(response))
    );
  }

  deleteExtractedAttendanceRegisterById(id: number): Observable<ExtractedAttendanceRegisterResponse> {
    return this.httpclient.delete(`${this.baseURL}/${this.subUrl}/${id}`).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        if (res.success) {
          const current = this.allActiveRegisters.getValue();
          const updated = current.filter(p => p.id !== id);
          this.allActiveRegisters.next(updated);
        }
        return res;
      })
    );
  }
}
