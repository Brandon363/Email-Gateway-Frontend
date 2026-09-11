import { ModelProvider } from "./enum.interface";
import { ExtractedVisaApplicationResponse } from "./extracted-visa-application.interface";
import { ExtractedBirthCertificateResponse } from "./extracted-birth-certificate.interface";
import { BirthCertificateResponse } from "./birth-certificate.interface";
import { ExtractedUserResponse } from "./extracted_user.interface";
import { BaseResponse } from "./shared.interface";
import { VisaApplicationResponse } from "./visa-application.interface";

export interface AgentChatRequest {
  query: string;
  model_provider: ModelProvider;
  language?: string;
}

export interface AgentStep {
  step_number: number;
  tool: string;
  tool_input: string;   // JSON string of arguments
  tool_output: string;  // JSON string of results
  thought: string;      // reasoning text
  log: string;          // short UI summary
}

export interface WhatsappMessage {
  from: string;
  message: string;
}

export interface AgentResponse extends BaseResponse {
  /** Final natural language response */
  final_answer: string;

  /** Steps the agent used to reach the answer */
  steps: AgentStep[];

  /** Optional execution metadata */
  execution_time?: number;

  grounding_html?: string;

  search_suggestions?: string[];

  audio_base64?: string;

  response_lang?: string;

  visa_applications_response?: VisaApplicationResponse;
  extracted_visa_applications_response?: ExtractedVisaApplicationResponse;
  extracted_birth_certificates_response?: ExtractedBirthCertificateResponse;
  birth_certificates_response?: BirthCertificateResponse;
  extracted_users_response?: ExtractedUserResponse;
}