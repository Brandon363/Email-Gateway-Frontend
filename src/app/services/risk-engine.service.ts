import { Injectable } from '@angular/core';
import { ValidationResult } from '../models/risk_engine.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RiskEngineService {
private baseURL = environment.baseUrl;
  private subUrl = 'risk_engine';   // MUST match backend prefix

  constructor(private httpclient: HttpClient) { }

  /**
   * Stateless risk analysis call.
   * Does NOT modify database.
   */
  analyzeRisk(applicationId: number): Observable<ValidationResult> {
    return this.httpclient
      .get<ValidationResult>(`${this.baseURL}/${this.subUrl}/risk/${applicationId}`)
      .pipe(
        map((response: ValidationResult) => {
          return response;
        })
      );
  }
}