# Project Dashboard - Marketing Automation Copilot Instructions

## Architecture Overview

This is a **Persian/Farsi RTL dashboard** built with strict separation between frontend (React/Vite) and backend (Express/SQLite). The system manages project tasks with Persian date support (Jalali calendar), comprehensive KPI tracking, and task dependency management.

### Key Components
- **Backend**: Express server (`server/`) on port 3002 with SQLite database
- **Frontend**: React/Vite app (`web/`) on port 5173 with API proxy to backend
- **Database**: SQLite with WAL mode, foreign keys enabled, uses `better-sqlite3`
- **Persian Support**: Full RTL UI with Jalali dates via `jalaliday` plugin
- **Testing**: Jest with ts-jest for backend API tests (`server/__tests__/`)

### Project Structure
```
server/
├── routes/          # API endpoints (each feature has its own file)
├── middleware/      # errorHandler.ts, performance.ts
├── scripts/         # Database utilities and migrations runners
├── migrations/      # SQL migration files
├── db.ts           # Database init with schema and sample data
├── types.ts        # Zod schemas for validation
└── index.ts        # Express app setup with all routes

web/src/
├── api/            # client.ts (React Query hooks), types.ts
├── components/     # Reusable UI components
├── pages/          # Dashboard, Analytics, TaskManager, Settings
├── lib/            # dayjs.ts (Jalali utilities), utils.ts
└── contexts/       # ThemeContext.tsx
```

## Development Workflow

### Essential Commands
```bash
# Start both frontend and backend simultaneously (PREFERRED)
npm run dev

# Individual services (when debugging one layer)
npm run dev:server:watch  # Backend with watch mode (port 3002)
npm run dev:web          # Frontend only (port 5173)

# Build for production
npm run build            # Builds both server and web to dist/

# Testing
npm test                 # Run Jest tests once
npm run test:watch       # Watch mode for TDD
npm run test:coverage    # Generate coverage report

# Database utilities (run with tsx)
tsx server/scripts/check_db.ts              # Inspect database state
tsx server/scripts/run_migration.ts         # Run SQL migrations
tsx server/scripts/create_sample_dependencies.ts  # Add test data
```

### Database Development
- Database auto-initializes on first run via `server/db.ts` `initializeSchema()`
- Schema includes sample data for testing (3 projects, 5 owners, 6 tasks)
- **ALL queries use prepared statements** (SQL injection protection)
- Complex queries with CTEs are in route files (`server/routes/*.ts`), NOT in separate SQL files
- Migrations are in `server/migrations/*.sql`, run via `server/scripts/run_migration.ts`
- Database pragma optimizations: WAL journal, 64MB cache, memory-mapped I/O

## Project-Specific Patterns

### Persian/RTL Implementation
- **All UI text is in Persian (Farsi)** - no English in user-facing strings
- **Dates**: Jalali calendar everywhere in UI via `web/src/lib/dayjs.ts`:
  - `formatJalaliDate(date)` → "1403/07/23"
  - `convertJalaliToGregorian(jalali)` → "2024-10-15" for API
  - `getTodayGregorian()` → ISO date for API queries
- **TailwindCSS**: `Vazirmatn` font, RTL classes (`text-right`, `mr-*` not `ml-*`)
- **API Contract**: Backend always expects/returns ISO dates (YYYY-MM-DD), UI converts

### API Architecture
- **Route Pattern**: One file per feature in `server/routes/` (kpi.ts, tasks.ts, dependencies.ts)
- **Registration**: All routes registered in `server/index.ts` via `app.use('/api/feature', router)`
- **Validation**: Zod schemas in `server/types.ts` with `safeParse()` pattern:
  ```typescript
  const result = TasksQuerySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: 'پارامترهای نامعتبر', details: result.error.issues });
  }
  ```
- **Error Handling**: Custom error classes in `middleware/errorHandler.ts`:
  - `ValidationError` (400), `NotFoundError` (404), `DatabaseError` (500)
  - Use `asyncHandler()` wrapper to catch async errors
  - Persian error messages logged with 🚨, ⚠️, ❌ emoji prefixes

### Database Patterns
```typescript
// Standard prepared statement pattern (used everywhere)
const query = db.prepare(`
  WITH metrics_cte AS (
    SELECT task_id, AVG(progress_percent) as avg_progress
    FROM fact_task_daily
    WHERE date_field <= ?
    GROUP BY task_id
  )
  SELECT t.*, m.avg_progress
  FROM task t
  LEFT JOIN metrics_cte m ON t.task_id = m.task_id
`);
const results = query.all(targetDate); // or .get() for single row

// For dynamic filters, build conditions array:
const conditions: string[] = [];
const params: any[] = [];
if (ownerId) {
  conditions.push('owner_id = ?');
  params.push(parseInt(ownerId));
}
const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
```

### Frontend State Management
- **React Query**: All server state (`web/src/api/client.ts`)
  - 5min stale time, 3 retries on failure
  - Custom hooks: `useKpi(date)`, `useTasks(query)`, `useDependencies(taskId)`
- **API Client**: Single class with logging for all requests/responses
- **Error Boundaries**: `components/ErrorBoundary.tsx` wraps major sections
- **Theme**: Context-based in `contexts/ThemeContext.tsx` (dark/light mode)

### Component Conventions
- **Layout**: `components/layout/Header.tsx`, `Sidebar.tsx`
- **Feature Components**: Prefix by feature (`TaskModal.tsx`, `TaskDependencies.tsx`)
- **Reusable UI**: `Button.tsx`, `Modal.tsx`, `LoadingSpinner.tsx`, `SkeletonLoader.tsx`
- **Charts/Tables**: Use `recharts` and `@tanstack/react-table` with Persian headers
- **Persian Numbers**: Display using Persian numeral formatting in UI

## Critical Integration Points

### API-Frontend Communication
```typescript
// Backend route pattern (server/routes/kpi.ts):
router.get('/', async (req, res) => {
  const { date } = req.query; // ISO: "2024-10-15"
  const result = db.prepare('SELECT ... WHERE date_field <= ?').all(date);
  res.json({ totalTasks: result.length, ... });
});

// Frontend API client (web/src/api/client.ts):
async getKpi(date?: string): Promise<KpiResponse> {
  return this.request<KpiResponse>(`/kpi${date ? `?date=${date}` : ''}`);
}

// React hook usage:
const { data: kpi, isLoading, error } = useQuery({
  queryKey: ['kpi', selectedDate],
  queryFn: () => apiClient.getKpi(selectedDate),
  staleTime: 5 * 60 * 1000,
  retry: 3
});
```

### Vite Proxy Configuration
- Frontend dev server (port 5173) proxies `/api` to backend (port 3002)
- Configured in `web/vite.config.ts`: `proxy: { '/api': { target: 'http://localhost:3002' } }`
- **Critical**: Backend port can be overridden via `BACKEND_PORT` or `PORT` env vars
- Production: Both built to `dist/` folder, served by single Express server

### Date Handling Flow
1. **UI Display**: User sees Jalali "1403/07/23" 
2. **API Request**: Convert to ISO "2024-10-15" via `convertJalaliToGregorian()`
3. **Database Storage**: TEXT fields with ISO dates
4. **API Response**: Returns ISO dates
5. **UI Render**: Convert back via `formatJalaliDate()` from `lib/dayjs.ts`

### Styling Conventions
- **TailwindCSS**: All styling, no custom CSS files
- **RTL Classes**: Use `text-right`, `mr-*` instead of `ml-*`
- **Dark Theme**: Gradient backgrounds (`from-gray-900 via-blue-900 to-purple-900`)
- **Persian Colors**: Custom primary color palette defined in `tailwind.config.js`

## Common Development Tasks

### Adding New API Endpoint
1. Create route file in `server/routes/newFeature.ts`
2. Add types to `server/types.ts` with Zod schema
3. Register route in `server/index.ts`
4. Add client method to `web/src/api/client.ts`
5. Create React hook in same file

### Adding New Table/Chart
- Use `@tanstack/react-table` for tables with Persian headers
- Use `recharts` for charts with RTL positioning
- Follow existing patterns in `components/Tables.tsx` and `components/Charts.tsx`

### Database Changes
- Modify schema in `server/db.ts` `initializeSchema()`
- Add indexes for performance (`CREATE INDEX IF NOT EXISTS...`)
- Update sample data insertion if needed

## Testing & Debugging

### Database Inspection
- SQLite file: `./project_dashboard.db`
- Use SQLite browser or CLI to inspect data
- Check WAL files (.db-wal, .db-shm) for recent changes

### API Debugging
- Backend logs all requests to console
- Frontend uses React Query Devtools (development only)
- Network tab shows API proxy working (localhost:5173/api → localhost:3002/api)

### Persian Date Issues
- Ensure `jalaliday` plugin is extended before use
- Format display dates with `formatJalaliDate()` from `lib/dayjs.ts`
- Server always expects/returns ISO dates, UI converts for display