import { z } from 'zod';

// Database schemas
export const ProjectSchema = z.object({
  project_id: z.number(),
  name: z.string(),
});

export const ModuleSchema = z.object({
  module_id: z.number(),
  project_id: z.number(),
  name: z.string(),
});

export const TeamSchema = z.object({
  team_id: z.number(),
  name: z.string(),
});

export const OwnerSchema = z.object({
  owner_id: z.number(),
  team_id: z.number(),
  display_name: z.string(),
  email: z.string(),
});

export const StatusSchema = z.object({
  status_id: z.number(),
  code: z.string(),
});

export const TaskSchema = z.object({
  task_id: z.number(),
  source_system: z.string(),
  external_task_id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  project_id: z.number(),
  module_id: z.number(),
  created_at: z.string(),
});

export const TaskDatesSchema = z.object({
  task_id: z.number(),
  start_at: z.string().nullable(),
  due_at: z.string().nullable(),
  closed_at: z.string().nullable(),
});

export const TaskAssignmentSchema = z.object({
  task_id: z.number(),
  owner_id: z.number(),
  valid_from: z.string(),
  valid_to: z.string().nullable(),
});

export const TaskStatusHistorySchema = z.object({
  task_id: z.number(),
  status_id: z.number(),
  progress_percent: z.number(),
  changed_at: z.string(),
});

export const FactTaskDailySchema = z.object({
  date_key: z.number(),
  task_id: z.number(),
  status_id: z.number(),
  owner_id: z.number(),
  progress_percent: z.number(),
  is_overdue: z.number(),
  days_overdue: z.number(),
});

// API Request/Response schemas
export const MetaResponseSchema = z.object({
  owners: z.array(z.object({ id: z.number(), label: z.string() })),
  statuses: z.array(z.object({ id: z.number(), label: z.string() })),
  projects: z.array(z.object({ id: z.number(), label: z.string() })),
  modules: z.array(z.object({ id: z.number(), label: z.string() })),
});

export const KpiResponseSchema = z.object({
  total_tasks: z.number(),
  done: z.number(),
  in_progress: z.number(),
  blocked: z.number(),
  overdue_count: z.number(),
  due_this_week_count: z.number(),
  avg_progress: z.number(),
});

export const StatusCountResponseSchema = z.object({
  status: z.string(),
  count: z.number(),
});

export const OwnerCountResponseSchema = z.object({
  owner: z.string(),
  count: z.number(),
});

export const OverdueTaskSchema = z.object({
  task_id: z.number(),
  title: z.string(),
  owner: z.string(),
  due_at: z.string(),
  status: z.string(),
  days_overdue: z.number(),
});

export const DueThisWeekTaskSchema = z.object({
  task_id: z.number(),
  title: z.string(),
  owner: z.string(),
  due_at: z.string(),
  status: z.string(),
});

export const TaskListResponseSchema = z.object({
  rows: z.array(z.object({
    task_id: z.number(),
    title: z.string(),
    owner: z.string(),
    status: z.string(),
    project: z.string(),
    module: z.string(),
    start_at: z.string().nullable(),
    due_at: z.string().nullable(),
    progress_percent: z.number(),
  })),
  total: z.number(),
});

export const TasksQuerySchema = z.object({
  page: z.string().optional().default('1'),
  pageSize: z.string().optional().default('20'),
  q: z.string().optional(),
  ownerId: z.string().optional(),
  statusCode: z.string().optional(),
  projectId: z.string().optional(),
  moduleId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

// Type exports
export type Project = z.infer<typeof ProjectSchema>;
export type Module = z.infer<typeof ModuleSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type Owner = z.infer<typeof OwnerSchema>;
export type Status = z.infer<typeof StatusSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type TaskDates = z.infer<typeof TaskDatesSchema>;
export type TaskAssignment = z.infer<typeof TaskAssignmentSchema>;
export type TaskStatusHistory = z.infer<typeof TaskStatusHistorySchema>;
export type FactTaskDaily = z.infer<typeof FactTaskDailySchema>;

export type MetaResponse = z.infer<typeof MetaResponseSchema>;
export type KpiResponse = z.infer<typeof KpiResponseSchema>;
export type StatusCountResponse = z.infer<typeof StatusCountResponseSchema>;
export type OwnerCountResponse = z.infer<typeof OwnerCountResponseSchema>;
export type OverdueTask = z.infer<typeof OverdueTaskSchema>;
export type DueThisWeekTask = z.infer<typeof DueThisWeekTaskSchema>;
export type TaskListResponse = z.infer<typeof TaskListResponseSchema>;
export type TasksQuery = z.infer<typeof TasksQuerySchema>;
