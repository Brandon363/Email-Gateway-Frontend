export interface ProductionDataDTO {
  id: number;
  user_id?: number;
  producer_name?: string;
  hectares?: number;
  wood_production_kg?: number;
  charcoal_produced_kg?: number;
  wood_sales_kg?: number;
  wood_sales_rand?: number;
  charcoal_sales_kg?: number;
  charcoal_sales_rand?: number;
  entity_status?: string;
  date_created?: string;
  date_updated?: string;
}

export interface ProductionDataResponse {
  status_code: number;
  success: boolean;
  message?: string;
  production_data?: ProductionDataDTO;
  production_data_list?: ProductionDataDTO[];
}
