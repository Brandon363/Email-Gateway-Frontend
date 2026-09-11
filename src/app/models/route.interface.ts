export interface EmailRoute {
  id: number;
  email_address: string;
  destination_webhook_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RouteCreateRequest {
  email_address: string;
  destination_webhook_url: string;
  is_active?: boolean;
}

export interface RouteUpdateRequest {
  email_address?: string;
  destination_webhook_url?: string;
  is_active?: boolean;
}

export interface RouteStats {
  total_routes: number;
  active_routes: number;
  total_inbound_emails: number;
  successful_forwards: number;
  failed_forwards: number;
}

export interface WebhookLogItem {
  id: number;
  provider: string;
  message_id?: string;
  from_address?: string;
  to_addresses?: string;
  subject?: string;
  destination_url?: string;
  status: 'SUCCESS' | 'FAILED' | 'NO_ROUTE' | string;
  status_message?: string;
  created_at: string;
}
