import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ExtractedProductionDataResponse } from '../models/extracted-production-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ExtractedProductionDataService {
  private apiUrl = `${environment.baseUrl}/extracted-production-data`;

  constructor(private http: HttpClient) {}

  extractExcelFile(file: File, userId: number = 1): Observable<ExtractedProductionDataResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ExtractedProductionDataResponse>(
      `${this.apiUrl}/extract-excel?user_id=${userId}`,
      formData
    );
  }

  getAllExtractedProductionData(): Observable<ExtractedProductionDataResponse> {
    return this.http.get<ExtractedProductionDataResponse>(`${this.apiUrl}/`);
  }

  getExtractedProductionDataById(id: number): Observable<ExtractedProductionDataResponse> {
    return this.http.get<ExtractedProductionDataResponse>(`${this.apiUrl}/${id}`);
  }

  deleteExtractedProductionData(id: number): Observable<ExtractedProductionDataResponse> {
    return this.http.delete<ExtractedProductionDataResponse>(`${this.apiUrl}/${id}`);
  }
}
