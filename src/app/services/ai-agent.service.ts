import { Injectable } from '@angular/core';
import { AgentChatRequest, AgentResponse } from '../models/ai-agent.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiAgentService {
  private baseURL = environment.baseUrl;
  private subUrl = "agent";

  constructor(
    private httpClient: HttpClient) { }

  map_to_response(data: any): AgentResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      errors: data.errors || null,
      final_answer: data.final_answer,
      steps: data.steps || [],
      execution_time: data.execution_time || null,
      audio_base64: data.audio_base64 || null,
      response_lang: data.response_lang || null,
      visa_applications_response: data.visa_applications_response || null,
      extracted_visa_applications_response: data.extracted_visa_applications_response || null,
    };
  }

  public chatWithAI(chatRequest: AgentChatRequest): Observable<AgentResponse> {
    return this.httpClient.post(`${this.baseURL}/${this.subUrl}/ask-agent`, chatRequest)
      .pipe(
        map((response: any) => {
          const chatWithModelResponse: AgentResponse = this.map_to_response(response);
          return chatWithModelResponse;
        })
      );
  }

  public chatWithAIWithTTS(chatRequest: AgentChatRequest): Observable<AgentResponse> {
    return this.httpClient.post(`${this.baseURL}/${this.subUrl}/ask-agent-with-tts`, chatRequest)
      .pipe(
        map((response: any) => {
          const chatWithModelResponse: AgentResponse = this.map_to_response(response);
          return chatWithModelResponse;
        })
      );
  }

  public clearChatHistory(): Observable<AgentResponse> {
    return this.httpClient.post(`${this.baseURL}/${this.subUrl}/clear-conversation`, "chatRequest")
      .pipe(
        map((response: any) => {
          const chatWithModelResponse: AgentResponse = this.map_to_response(response);
          return chatWithModelResponse;
        })
      );
  }
}
