export interface Car {
  id: string;
  vin: string;
  make: string;
  model: string;
  price_usd?: number;
  price_kzt?: number;
  status: 'available' | 'transit' | 'reserved' | 'sold';
  image_url: string;
  location?: string;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  expires: string;
}

export interface Lead {
  id: string;
  car_model: string;
  customer_name: string;
  customer_phone: string;
  inquiry_type: string;
  status: string;
  created_at: string;
}

export interface DashboardData {
  inventory: Car[];
  leads: Lead[];
}

export interface User {
  username: string;
  role: string;
}

export interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };
}
