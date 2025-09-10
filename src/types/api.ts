export interface User {
  id: number;
  name: string;
  email: string;
}

export interface EventType {
  id: number;
  name: string;
  code: string;
}

export interface Event {
  id: number;
  name: string;
  completed: boolean;
  type: EventType | null;
  user: User;
  activateDate: string | null;
  activateTime: string | null;
}

export interface Goal {
  id: number;
  name: string;
  completed: boolean;
  user: User;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface CreateEventRequest {
  name: string;
  type_id?: number;
  activate_at?: string;
}

export interface UpdateEventRequest {
  name?: string;
  type_id?: number;
  activate_at?: string;
}

export interface CreateGoalRequest {
  name: string;
}

export interface UpdateGoalRequest {
  name?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatar?: string;
}