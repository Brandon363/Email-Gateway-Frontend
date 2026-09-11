import { EntityStatus } from "./enum.interface";
import { DocumentDTO } from "./document.interface";
import { BaseResponse } from "./shared.interface";

export interface BaselineSurveyDTO {
  id: number;
  user_id?: number;
  timestamp?: string;
  first_name?: string;
  surname?: string;
  company_name?: string;
  is_registered?: string;
  num_owners?: string;
  shareholders_info?: string;
  cipc_number?: string;
  cleared_invasive_plants?: string;
  cleared_areas?: string;
  cleared_hectares?: string;
  cleared_species?: string;
  other_environmental_business?: string;
  main_focus_areas?: string;
  fulltime_employees?: string;
  parttime_employees?: string;
  activities_services?: string;
  annual_turnover_info?: string;
  household_size?: string;
  dependents_count?: string;
  previously_employed?: string;
  employment_duration?: string;
  currently_employed?: string;
  reason_for_leaving?: string;
  has_laptop?: string;
  has_tablet?: string;
  has_smartphone?: string;
  has_online_banking?: string;
  concept_revenue_familiarity?: string;
  concept_gross_profit_familiarity?: string;
  concept_net_familiarity?: string;
  concept_cash_flow_familiarity?: string;
  concept_payroll_familiarity?: string;
  concept_costs_familiarity?: string;
  separate_bank_account?: string;
  uses_business_money_for_personal?: string;
  keeps_financial_records?: string;
  tracks_income_expenses?: string;
  budgets_spending?: string;
  involved_other_business?: string;
  additional_business_areas?: string;
  collaborates_network?: string;
  popi_consent?: string;
  email_address?: string;

  entity_status?: EntityStatus;
  date_created?: string;
  date_updated?: string;
  documents?: DocumentDTO[];
}

export interface BaselineSurveyResponse extends BaseResponse {
  baseline_survey?: BaselineSurveyDTO;
  baseline_surveys?: BaselineSurveyDTO[];
}
