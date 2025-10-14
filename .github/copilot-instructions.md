# Project Dashboard - Marketing Automation Copilot Instructions

## Architecture Overview

This is a **Persian/Farsi RTL dashboard** built with a strict separation between frontend (React/Vite) and backend (Express/SQLite). The system manages project tasks with Persian date support (Jalali calendar) and comprehensive KPI tracking.

### Key Components
- **Backend**: Express server (`server/`) on port 3002 with SQLite database
- **Frontend**: React/Vite app (`web/`) on port 5173 with API proxy
- **Database**: SQLite with WAL mode, foreign keys enabled, uses `better-sqlite3`
- **Persian Support**: Full RTL UI with Jalali dates via `jalaliday` plugin

## Development Workflow

### Essential Commands
```bash
# Start both frontend and backend simultaneously
npm run dev

# Individual services
npm run dev:server    # Backend only (port 3002)
npm run dev:web      # Frontend only (port 5173)

# Build for production
npm run build        # Builds both server and web to dist/
```

### Database Development
- Database auto-initializes on first run via `server/db.ts`
- Schema includes sample data for testing
- Uses prepared statements for all queries (SQL injection protection)
- Complex queries are in route files, not centralized SQL files

## Project-Specific Patterns

### Persian/RTL Implementation
- All UI text is in Persian (Farsi)
- Dates use Jalali calendar: `dayjs().calendar('jalali').format('jYYYY/jMM/jDD')`
- TailwindCSS configured with `Vazirmatn` font and RTL support
- Date inputs/APIs expect ISO dates but display as Jalali

### API Architecture
- **Routes**: Each feature has its own route file in `server/routes/`
- **Types**: Shared Zod schemas in `server/types.ts` and `web/src/api/types.ts`
- **Client**: API client with React Query hooks in `web/src/api/client.ts`
- **Error Handling**: Consistent error responses with retry logic

### Database Patterns
```typescript
// Standard query pattern used throughout routes
const query = db.prepare(`
  WITH complex_cte AS (...)
  SELECT ... FROM complex_cte
  WHERE date_field <= ?
`);
const results = query.all(targetDate);
```

### Frontend State Management
- **React Query**: All server state with 5min stale time, 3 retries
- **Local State**: Component state for UI interactions only
- **Error Boundaries**: Wrap major sections for graceful error handling

### Component Structure
- **Layout**: `components/layout/` (Header, Sidebar)
- **Feature Components**: `components/` (Charts, Tables, Modals)
- **Pages**: `pages/` (Dashboard, TaskManager, Analytics, Settings)
- **Utilities**: `lib/` (dayjs setup, utilities)

## Critical Integration Points

### API-Frontend Communication
```typescript
// API endpoints follow this pattern:
GET /api/kpi?date=YYYY-MM-DD
GET /api/tasks?page=1&pageSize=10&q=search&ownerId=1

// React hooks pattern:
const { data, isLoading, error } = useQuery({
  queryKey: ['kpi', date],
  queryFn: () => apiClient.getKpi(date)
});
```

### Date Handling
- **API Layer**: Always use ISO dates (YYYY-MM-DD)
- **UI Layer**: Display as Jalali using `formatJalaliDate()`
- **Database**: Store as TEXT in ISO format

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