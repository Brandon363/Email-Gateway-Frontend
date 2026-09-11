import { EntityStatus } from "./enum.interface";
import { BaselineSurveyDTO } from "./baseline-survey.interface";
import { BaseResponse } from "./shared.interface";

export interface ExtractedBaselineSurveyDTO {
  id: number;
  baseline_survey_id?: number;
  overall_confidence_score?: number;
  date_created: string;
  date_updated?: string;
  entity_status: EntityStatus;

  file_name?: string;
  total_responses?: number;
  raw_responses_json?: BaselineSurveyDTO[];
  baseline_survey?: BaselineSurveyDTO;
}

export interface ExtractedBaselineSurveyResponse extends BaseResponse {
  extracted_baseline_survey?: ExtractedBaselineSurveyDTO;
  extracted_baseline_surveys?: ExtractedBaselineSurveyDTO[];
}
