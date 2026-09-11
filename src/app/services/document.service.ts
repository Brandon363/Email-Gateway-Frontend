import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentResponse } from '../models/document.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseURL = environment.baseUrl;
  private subUrl = "document"

  constructor(private httpclient: HttpClient,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer,
  ) { }


  public getDocumentById(documentId: number): Observable<DocumentResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}` + "/get-document-by-id/" + documentId)
      .pipe(
        map((response: any) => {
          // map the response to a documentResponse object
          return {
            success: response['success'],
            statusCode: response['status_code'],
            message: response['message'],
            document: response['document'] || null,
            documents: response['documents'] || null,
            errors: response['errors'] || null,
          } as DocumentResponse;
        })
      );
  }

  getDocumentFile(documentId: number): Observable<Blob> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-document-file-by-id/${documentId}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': '*/*' 
      })
    });
  }


  getIdDocumentFileByUserId(user_id: number): Observable<Blob> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-id-document-file-by-user-id/${user_id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': '*/*' 
      })
    });
  }

  
  getApplicationDocumentFileByTemporaryLossApplicationId(user_id: number): Observable<Blob> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-id-document-file-by-application-id/${user_id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': '*/*' 
      })
    });
  }


  viewDocument(documentId: number): Observable<SafeResourceUrl> {
    return this.getDocumentFile(documentId).pipe(
      map(blob => {
        const url = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
    );
  }
  

  viewIdDocumentFileByUserId(user_id: number): Observable<SafeResourceUrl> {
    return this.getIdDocumentFileByUserId(user_id).pipe(
      map(blob => {
        const url = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
    );
  }

  getBirthCertificateFileByCertificateId(birth_certificate_id: number): Observable<Blob> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-birth-certificate-file-by-certificate-id/${birth_certificate_id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': '*/*'
      })
    });
  }

  viewBirthCertificateFileByCertificateId(birth_certificate_id: number): Observable<SafeResourceUrl> {
    return this.getBirthCertificateFileByCertificateId(birth_certificate_id).pipe(
      map(blob => {
        const url = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
    );
  }

  getAttendanceRegisterFileByRegisterId(attendance_register_id: number): Observable<Blob> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-attendance-register-file-by-register-id/${attendance_register_id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': '*/*'
      })
    });
  }

  viewAttendanceRegisterFileByRegisterId(attendance_register_id: number): Observable<SafeResourceUrl> {
    return this.getAttendanceRegisterFileByRegisterId(attendance_register_id).pipe(
      map(blob => {
        const url = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
    );
  }

  getBaselineSurveyFileBySurveyId(baseline_survey_id: number): Observable<Blob> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-baseline-survey-file-by-survey-id/${baseline_survey_id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': '*/*'
      })
    });
  }

  viewBaselineSurveyFileBySurveyId(baseline_survey_id: number): Observable<SafeResourceUrl> {
    return this.getBaselineSurveyFileBySurveyId(baseline_survey_id).pipe(
      map(blob => {
        const url = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
    );
  }

  getProductionDataFileByProductionId(production_id: number): Observable<Blob> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-production-data-file-by-production-id/${production_id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': '*/*'
      })
    });
  }

  viewProductionDataFileByProductionId(production_id: number): Observable<SafeResourceUrl> {
    return this.getProductionDataFileByProductionId(production_id).pipe(
      map(blob => {
        const url = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      })
    );
  }

}

