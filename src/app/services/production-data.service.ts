import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductionDataResponse, ProductionDataDTO } from '../models/production-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductionDataService {
  private apiUrl = `${environment.baseUrl}/production-data`;

  constructor(private http: HttpClient) {}

  getAllProductionData(): Observable<ProductionDataResponse> {
    return this.http.get<ProductionDataResponse>(`${this.apiUrl}/`);
  }

  getProductionDataById(id: number): Observable<ProductionDataResponse> {
    return this.http.get<ProductionDataResponse>(`${this.apiUrl}/${id}`);
  }

  createProductionData(data: Partial<ProductionDataDTO>): Observable<ProductionDataResponse> {
    return this.http.post<ProductionDataResponse>(`${this.apiUrl}/`, data);
  }

  deleteProductionData(id: number): Observable<ProductionDataResponse> {
    return this.http.delete<ProductionDataResponse>(`${this.apiUrl}/${id}`);
  }
}
