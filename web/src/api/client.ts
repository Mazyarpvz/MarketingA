import { useQuery } from '@tanstack/react-query';
import {
  MetaResponse,
  KpiResponse,
  StatusCountResponse,
  OwnerCountResponse,
  OverdueTask,
  DueThisWeekTask,
  TaskListResponse,
  TasksQuery,
} from './types';

const API_BASE_URL = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      console.log(`Response status: ${response.status} for ${endpoint}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log(`API Response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  async getMeta(): Promise<MetaResponse> {
    return this.request<MetaResponse>('/meta');
  }

  async getKpi(date?: string): Promise<KpiResponse> {
    const params = date ? `?date=${date}` : '';
    return this.request<KpiResponse>(`/kpi${params}`);
  }

  async getStatusCounts(date?: string): Promise<StatusCountResponse[]> {
    const params = date ? `?date=${date}` : '';
    return this.request<StatusCountResponse[]>(`/status-counts${params}`);
  }

  async getOwnerCounts(date?: string): Promise<OwnerCountResponse[]> {
    const params = date ? `?date=${date}` : '';
    return this.request<OwnerCountResponse[]>(`/owner-counts${params}`);
  }

  async getOverdue(date?: string): Promise<OverdueTask[]> {
    const params = date ? `?date=${date}` : '';
    return this.request<OverdueTask[]>(`/overdue${params}`);
  }

  async getDueThisWeek(date?: string): Promise<DueThisWeekTask[]> {
    const params = date ? `?date=${date}` : '';
    return this.request<DueThisWeekTask[]>(`/due-this-week${params}`);
  }

  async getTasks(query: TasksQuery = {}): Promise<TaskListResponse> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    return this.request<TaskListResponse>(`/tasks${queryString ? `?${queryString}` : ''}`);
  }

  async createTask(taskData: any): Promise<{ success: boolean; taskId: string; message: string }> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, taskData: any): Promise<{ success: boolean; message: string }> {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

// React Query hooks
export const useMeta = () => {
  return useQuery({
    queryKey: ['meta'],
    queryFn: () => apiClient.getMeta(),
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useKpi = (date?: string) => {
  return useQuery({
    queryKey: ['kpi', date],
    queryFn: () => apiClient.getKpi(date),
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useStatusCounts = (date?: string) => {
  return useQuery({
    queryKey: ['statusCounts', date],
    queryFn: () => apiClient.getStatusCounts(date),
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useOwnerCounts = (date?: string) => {
  return useQuery({
    queryKey: ['ownerCounts', date],
    queryFn: () => apiClient.getOwnerCounts(date),
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useOverdue = (date?: string) => {
  return useQuery({
    queryKey: ['overdue', date],
    queryFn: () => apiClient.getOverdue(date),
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useDueThisWeek = (date?: string) => {
  return useQuery({
    queryKey: ['dueThisWeek', date],
    queryFn: () => apiClient.getDueThisWeek(date),
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useTasks = (query: TasksQuery = {}) => {
  return useQuery({
    queryKey: ['tasks', query],
    queryFn: () => apiClient.getTasks(query),
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
