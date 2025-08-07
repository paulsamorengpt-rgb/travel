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
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  maxParticipants: number;
  currentParticipants: number;
  organizer: User;
  images: string[];
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  transport: string[];
  accommodation: string[];
  meals: boolean;
  createdAt: string;
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