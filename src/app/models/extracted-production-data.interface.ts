export interface ExtractedProductionDataDTO {
  id: number;
  production_data_id?: number;
  overall_confidence_score?: number;
  file_name?: string;
  sheet_name?: string;
  total_producers?: number;
  grand_total_hectares?: number;
  grand_total_wood_kg?: number;
  grand_total_charcoal_kg?: number;
  grand_total_wood_sales_rand?: number;
  grand_total_charcoal_sales_rand?: number;
  raw_responses_json?: any[];
  entity_status?: string;
  date_created?: string;
  date_updated?: string;
}

export interface ExtractedProductionDataResponse {
  status_code: number;
  success: boolean;
  message?: string;
  extracted_production_data?: ExtractedProductionDataDTO;
  extracted_production_data_list?: ExtractedProductionDataDTO[];
}
