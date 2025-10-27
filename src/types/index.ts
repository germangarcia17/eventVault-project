export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'music' | 'sports' | 'arts' | 'tech' | 'food' | 'workshop';
  price: number;
  date: string;
  location: string;
  image_url: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  event_id: string;
  payment_status: 'pending' | 'paid' | 'canceled';
  qr_code: string;
  created_at: string;
  event?: Event;
}

export interface AuthUser {
  id: string;
  email: string;
}
