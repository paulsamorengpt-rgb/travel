export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
  reviewsCount: number;
  bio?: string;
  location: string;
  joinedDate: string;
  verified: boolean;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  destination: string;
  dates: TourDate[];
  price: number;
  currency: string;
  maxParticipants: number;
  organizer: User;
  images: string[];
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  transport: string[];
  accommodation: string[];
  meals: boolean;
  createdAt: string;
}

export interface TourDate {
  id: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  status: 'available' | 'full' | 'cancelled';
}

export interface BookingRequest {
  tourId: string;
  tourDateId: string;
  participantsCount: number;
  totalPrice: number;
  contactInfo: {
    phone: string;
    emergencyContact: string;
    specialRequests?: string;
  };
}

export interface Booking {
  id: string;
  tourId: string;
  tourDateId: string;
  userId: string;
  participantsCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  contactInfo: {
    phone: string;
    emergencyContact: string;
    specialRequests?: string;
  };
  createdAt: string;
  paymentDeadline: string;
}

export interface Review {
  id: string;
  author: User;
  targetUser: User;
  tourId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}