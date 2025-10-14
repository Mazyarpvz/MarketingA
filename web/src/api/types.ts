// API Response Types
export interface MetaResponse {
  owners: Array<{ id: number; label: string }>;
  statuses: Array<{ id: number; label: string }>;
  projects: Array<{ id: number; label: string }>;
  modules: Array<{ id: number; label: string }>;
}

export interface KpiResponse {
  total_tasks: number;
  done: number;
  in_progress: number;
  blocked: number;
  overdue_count: number;
  due_this_week_count: number;
  avg_progress: number;
}

export interface StatusCountResponse {
  status: string;
  count: number;
}

export interface OwnerCountResponse {
  owner: string;
  count: number;
}

export interface OverdueTask {
  task_id: number;
  title: string;
  owner: string;
  due_at: string;
  status: string;
  days_overdue: number;
}

export interface DueThisWeekTask {
  task_id: number;
  title: string;
  owner: string;
  due_at: string;
  status: string;
}

export interface TaskListResponse {
  rows: Array<{
    task_id: number;
    title: string;
    owner: string;
    status: string;
    project: string;
    module: string;
    start_at: string | null;
    due_at: string | null;
    progress_percent: number;
  }>;
  total: number;
}

export interface TasksQuery {
  page?: string;
  pageSize?: string;
  q?: string;
  ownerId?: string;
  statusCode?: string;
  projectId?: string;
  moduleId?: string;
  dateFrom?: string;
  dateTo?: string;
}
