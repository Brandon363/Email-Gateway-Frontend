import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ExtractedTextResponse } from '../models/free_text_test.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FreeTextTestService {
  private baseURL = environment.baseUrl;
  private subUrl = 'free_text';

  constructor(
    private httpclient: HttpClient
  ) { }


  mapToResponse(data: any): ExtractedTextResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      text: data.text || null,
      texts: data.texts || null,
      raw_text: data.raw_text || null,
      notifications: data.notifications || null,
      notification: data.notification || null,
    };
  }


  extractUser(request: FormData): Observable<ExtractedTextResponse> {

    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/free-text`, request).pipe(
      map((response: any) => {
        const extractedUserResponse = this.mapToResponse(response);
        return extractedUserResponse;
      })
    );
  }


}