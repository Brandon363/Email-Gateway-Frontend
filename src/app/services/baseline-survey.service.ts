import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { BaselineSurveyResponse } from "../models/baseline-survey.interface";

@Injectable({
  providedIn: "root",
})
export class BaselineSurveyService {
  private apiUrl = `${environment.baseUrl}/baseline-surveys`;

  constructor(private http: HttpClient) {}

  getAllBaselineSurveys(): Observable<BaselineSurveyResponse> {
    return this.http.get<BaselineSurveyResponse>(`${this.apiUrl}/`);
  }

  getBaselineSurveyById(id: number): Observable<BaselineSurveyResponse> {
    return this.http.get<BaselineSurveyResponse>(`${this.apiUrl}/${id}`);
  }

  deleteBaselineSurvey(id: number): Observable<BaselineSurveyResponse> {
    return this.http.delete<BaselineSurveyResponse>(`${this.apiUrl}/${id}`);
  }
}
