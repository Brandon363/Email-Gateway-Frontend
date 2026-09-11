import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EmailRoute, RouteCreateRequest, RouteStats, RouteUpdateRequest, WebhookLogItem } from '../models/route.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailRouteService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllRoutes(): Observable<EmailRoute[]> {
    return this.http.get<EmailRoute[]>(`${this.baseUrl}/routes`);
  }

  getStats(): Observable<RouteStats> {
    return this.http.get<RouteStats>(`${this.baseUrl}/routes/stats`);
  }

  getLogs(limit: number = 50): Observable<WebhookLogItem[]> {
    return this.http.get<WebhookLogItem[]>(`${this.baseUrl}/routes/logs?limit=${limit}`);
  }

  getRouteById(id: number): Observable<EmailRoute> {
    return this.http.get<EmailRoute>(`${this.baseUrl}/routes/${id}`);
  }

  createRoute(route: RouteCreateRequest): Observable<EmailRoute> {
    return this.http.post<EmailRoute>(`${this.baseUrl}/routes`, route);
  }

  updateRoute(id: number, route: RouteUpdateRequest): Observable<EmailRoute> {
    return this.http.put<EmailRoute>(`${this.baseUrl}/routes/${id}`, route);
  }

  deleteRoute(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/routes/${id}`);
  }

  testRoute(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/routes/${id}/test`, {});
  }
}
