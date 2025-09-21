import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Event,
  Goal,
  EventType,
  Profile,
  User,
  CreateEventRequest,
  UpdateEventRequest,
  CreateGoalRequest,
  UpdateGoalRequest,
  UpdateProfileRequest,
} from '@/types/api';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth methods
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<{token: string}> {
    return this.request<{token: string}>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    await this.request<void>('/logout', {
      method: 'GET',
    });
    this.setToken(null);
  }

  // Event methods
  async getEvents(date?: string): Promise<Event[]> {
    const url = date ? `/event?date=${date}` : '/event';
    return this.request<Event[]>(url);
  }

  async getCompletedEvents(date?: string): Promise<Event[]> {
    const url = date ? `/event/completed?date=${date}` : '/event/completed';
    return this.request<Event[]>(url);
  }

  async getEventById(id: number): Promise<Event> {
    return this.request<Event>(`/event/${id}`);
  }

  async createEvent(data: CreateEventRequest): Promise<Event> {
    return this.request<Event>('/event', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: number, data: UpdateEventRequest): Promise<Event> {
    return this.request<Event>(`/event/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: number): Promise<void> {
    return this.request<void>(`/event/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleEventStatus(id: number): Promise<Event> {
    return this.request<Event>(`/event/${id}/statusChange`);
  }

  async getEventTypes(): Promise<EventType[]> {
    return this.request<EventType[]>('/event/types');
  }

  async getEventsByType(typeCode: string, date?: string): Promise<Event[]> {
    const url = date ? `/event/${typeCode}?date=${date}` : `/event/${typeCode}`;
    return this.request<Event[]>(url);
  }

  async getCompletedEventsByType(typeCode: string, date?: string): Promise<Event[]> {
    const url = date ? `/event/${typeCode}/completed?date=${date}` : `/event/${typeCode}/completed`;
    return this.request<Event[]>(url);
  }

  // Goal methods
  async getGoals(): Promise<Goal[]> {
    return this.request<Goal[]>('/goal');
  }

  async getCompletedGoals(): Promise<Goal[]> {
    return this.request<Goal[]>('/goal/completed');
  }

  async getGoalById(id: number): Promise<Goal> {
    return this.request<Goal>(`/goal/${id}`);
  }

  async createGoal(data: CreateGoalRequest): Promise<Goal> {
    return this.request<Goal>('/goal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGoal(id: number, data: UpdateGoalRequest): Promise<Goal> {
    return this.request<Goal>(`/goal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGoal(id: number): Promise<void> {
    return this.request<void>(`/goal/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleGoalStatus(id: number): Promise<Goal> {
    return this.request<Goal>(`/goal/${id}/statusChange`);
  }

  // Profile methods
  async getProfile(): Promise<Profile> {
    return this.request<Profile>('/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<Profile> {
    return this.request<Profile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();