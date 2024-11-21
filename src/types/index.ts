export type RequestStatus = 'WAITING_FOR_QUOTATION' | 'QUOTATION_RECEIVED' | 'ACCEPTED' | 'REJECTED';

export interface ShippingRequest {
  id: string;
  user_id: string;
  pickup_address: string;
  delivery_address: string;
  package_details: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    description: string;
  };
  preferred_pickup_date: string;
  preferred_delivery_date: string;
  status: RequestStatus;
  quotation_amount?: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}