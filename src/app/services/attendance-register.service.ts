import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AttendanceRegisterDTO, AttendanceRegisterResponse, AttendanceRegisterCreateRequest, AttendanceRegisterUpdateRequest } from '../models/attendance-register.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceRegisterService {
  private baseURL = environment.baseUrl;
  private subUrl = 'attendance-registers';
  private allActiveRegisters = new BehaviorSubject<AttendanceRegisterDTO[]>([]);

  public selectedRegister!: AttendanceRegisterDTO;

  constructor(private httpclient: HttpClient) { }

  mapToResponse(data: any): AttendanceRegisterResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      attendance_register: data.attendance_register || null,
      attendance_registers: data.attendance_registers || null,
    };
  }

  updateRegisterData(registers: AttendanceRegisterDTO[] | AttendanceRegisterDTO) {
    if (Array.isArray(registers)) {
      this.allActiveRegisters.next(registers);
    } else {
      const current = this.allActiveRegisters.getValue();
      current.push(registers);
      this.allActiveRegisters.next(current);
    }
  }

  retrieveRegisterData(): Observable<AttendanceRegisterDTO[]> {
    return this.allActiveRegisters.asObservable();
  }

  getAllAttendanceRegisters(): Observable<AttendanceRegisterResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/`).pipe(
      map((response: any) => {
        const res = this.mapToResponse(response);
        if (res.success && res.attendance_registers) {
          this.updateRegisterData(res.attendance_registers);
        }
        return res;
      })
    );
  }

  getAttendanceRegisterById(id: number): Observable<AttendanceRegisterResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/${id}`).pipe(
      map((response: any) => this.mapToResponse(response))
    );
  }

  createAttendanceRegister(request: AttendanceRegisterCreateRequest): Observable<AttendanceRegisterResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/`, request).pipe(
      map((response: any) => this.mapToResponse(response))
    );
  }

  updateAttendanceRegister(id: number, request: AttendanceRegisterUpdateRequest): Observable<AttendanceRegisterResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/${id}`, request).pipe(
      map((response: any) => this.mapToResponse(response))
    );
  }

  deleteAttendanceRegister(id: number): Observable<AttendanceRegisterResponse> {
    return this.httpclient.delete(`${this.baseURL}/${this.subUrl}/${id}`).pipe(
      map((response: any) => this.mapToResponse(response))
    );
  }
}
