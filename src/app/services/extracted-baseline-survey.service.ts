import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ExtractedBaselineSurveyResponse } from "../models/extracted-baseline-survey.interface";

@Injectable({
  providedIn: "root",
})
export class ExtractedBaselineSurveyService {
  private apiUrl = `${environment.baseUrl}/extracted-baseline-surveys`;

  constructor(private http: HttpClient) {}

  extractBaselineSurvey(file: File, userId: number): Observable<ExtractedBaselineSurveyResponse> {
    const formData = new FormData();
    formData.append("excel_file", file);
    formData.append("user_id", userId.toString());

    return this.http.post<ExtractedBaselineSurveyResponse>(
      `${this.apiUrl}/extract`,
      formData
    );
  }

  getAllExtractedBaselineSurveys(): Observable<ExtractedBaselineSurveyResponse> {
    return this.http.get<ExtractedBaselineSurveyResponse>(`${this.apiUrl}/`);
  }

  getExtractedBaselineSurveyById(id: number): Observable<ExtractedBaselineSurveyResponse> {
    return this.http.get<ExtractedBaselineSurveyResponse>(`${this.apiUrl}/${id}`);
  }

  deleteExtractedBaselineSurvey(id: number): Observable<ExtractedBaselineSurveyResponse> {
    return this.http.delete<ExtractedBaselineSurveyResponse>(`${this.apiUrl}/${id}`);
  }
}
