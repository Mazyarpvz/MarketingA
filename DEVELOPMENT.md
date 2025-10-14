# راهنمای توسعه

این راهنما اطلاعات تکمیلی برای توسعه‌دهندگان پروژه را فراهم می‌کند.

## پیش‌نیازها

- **Node.js** 18.x یا بالاتر
- **npm** 9.x یا بالاتر
- **Git** برای version control

## راه‌اندازی اولیه

```bash
# کلون کردن پروژه
git clone <repository-url>
cd project-dashboard

# نصب dependencies
npm install

# ایجاد فایل محیط
cp env.example .env

# اجرای پروژه در حالت development
npm run dev
```

## ساختار پروژه

```
project-dashboard/
├── server/                 # Backend (Express + SQLite)
│   ├── routes/            # API endpoints
│   ├── db.ts              # Database configuration
│   ├── types.ts           # Zod schemas & TypeScript types
│   ├── utils.ts           # Helper functions
│   └── index.ts           # Express server setup
│
├── web/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── layout/   # Header, Sidebar
│   │   │   └── ...       # Feature components
│   │   ├── pages/        # Page components
│   │   ├── api/          # API client & types
│   │   ├── lib/          # Utilities & config
│   │   │   ├── dayjs.ts  # Date utilities
│   │   │   ├── utils.ts  # General utilities
│   │   │   └── config.ts # App configuration
│   │   └── styles/       # Global styles
│   └── vite.config.ts    # Vite configuration
│
└── .github/
    └── copilot-instructions.md  # AI assistant guidelines
```

## دستورات مهم

### Development
```bash
# اجرای همزمان frontend و backend
npm run dev

# اجرای جداگانه
npm run dev:server    # Backend روی port 3002
npm run dev:web      # Frontend روی port 5173
```

### Build
```bash
# Build کل پروژه
npm run build

# Build جداگانه
npm run build:server  # TypeScript compilation
npm run build:web    # Vite build
```

### Production
```bash
# اجرای production build
npm start
```

### Type Checking
```bash
npm run type-check
```

## معماری Backend

### Database (SQLite)
- استفاده از `better-sqlite3` برای عملکرد بهتر
- WAL mode برای concurrency
- Foreign keys فعال
- Indexes برای بهینه‌سازی queries

### API Routes
هر route در فایل جداگانه در `server/routes/`:
- `meta.ts` - فیلترها و metadata
- `kpi.ts` - KPI metrics
- `statusCounts.ts` - آمار وضعیت‌ها
- `ownerCounts.ts` - آمار مالکان
- `overdue.ts` - تسک‌های معوق
- `dueThisWeek.ts` - تسک‌های این هفته
- `tasks.ts` - لیست کامل تسک‌ها

### Type Safety
- استفاده از Zod برای validation
- TypeScript types مشترک بین frontend و backend
- Schemas در `server/types.ts` و `web/src/api/types.ts`

## معماری Frontend

### State Management
- **React Query** برای server state
- **Local State** برای UI state
- Stale time: 5 دقیقه
- Retry logic: 3 بار با exponential backoff

### Styling
- **TailwindCSS** برای تمام استایل‌ها
- **RTL Support** برای فارسی
- **Vazirmatn Font** برای متن فارسی
- Gradient backgrounds برای dark theme

### Date Handling
- **dayjs** + **jalaliday** برای تاریخ جلالی
- API همیشه ISO dates می‌فرستد (YYYY-MM-DD)
- UI همیشه تاریخ جلالی نمایش می‌دهد
- استفاده از `lib/dayjs.ts` برای تبدیل

## الگوهای توسعه

### اضافه کردن API جدید

1. ایجاد route در `server/routes/newFeature.ts`:
```typescript
import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db';

const router = Router();

const QuerySchema = z.object({
  param: z.string().optional(),
});

router.get('/', async (req, res) => {
  try {
    const result = QuerySchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ 
        error: 'پارامترهای نامعتبر',
        details: result.error.issues 
      });
    }
    
    const db = getDb();
    // query logic...
    
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'خطا' });
  }
});

export default router;
```

2. اضافه کردن به `server/index.ts`:
```typescript
import newFeatureRouter from './routes/newFeature';
app.use('/api/new-feature', newFeatureRouter);
```

3. اضافه کردن client method در `web/src/api/client.ts`:
```typescript
async getNewFeature(param?: string): Promise<ResponseType> {
  return this.request('/new-feature' + (param ? `?param=${param}` : ''));
}
```

4. ایجاد React hook:
```typescript
export function useNewFeature(param?: string) {
  return useQuery({
    queryKey: ['newFeature', param],
    queryFn: () => apiClient.getNewFeature(param),
  });
}
```

### اضافه کردن Component جدید

1. ایجاد component در `web/src/components/`:
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  className?: string;
}

export function MyComponent({ title, className }: MyComponentProps) {
  return (
    <div className={cn('bg-white/10 backdrop-blur-lg rounded-lg p-6', className)}>
      <h3 className="text-right text-xl font-bold mb-4">{title}</h3>
      {/* content */}
    </div>
  );
}
```

2. استفاده در page یا component دیگر:
```typescript
import { MyComponent } from '@/components/MyComponent';

<MyComponent title="عنوان" />
```

### کار با تاریخ

```typescript
import { formatJalaliDate, getTodayGregorian } from '@/lib/dayjs';

// تبدیل ISO date به جلالی برای نمایش
const displayDate = formatJalaliDate('2024-01-15'); // ۱۴۰۲/۱۰/۲۵

// گرفتن تاریخ امروز برای ارسال به API
const today = getTodayGregorian(); // 2024-01-15
```

## بهینه‌سازی‌ها

### Database
- استفاده از indexes برای columns پرتکرار
- استفاده از CTEs برای queries پیچیده
- Prepared statements برای امنیت و سرعت

### Frontend
- React Query برای caching و deduplication
- Lazy loading برای components بزرگ
- Memoization برای calculations پرهزینه
- Debouncing برای search inputs

### Performance Monitoring
- Console logs برای API requests
- React Query DevTools در development
- Network tab برای بررسی API calls

## Testing

```bash
# فعلاً tests وجود ندارد
npm test
```

## Debugging

### Backend
- چک کردن console logs
- بررسی فایل database با SQLite browser
- استفاده از Postman برای تست APIs

### Frontend
- React DevTools برای component debugging
- React Query DevTools برای cache inspection
- Network tab برای API debugging
- Console برای error tracking

## Common Issues

### Database Lock
اگر database قفل شد:
```bash
# پاک کردن WAL files
rm project_dashboard.db-wal project_dashboard.db-shm
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# پیدا کردن و kill کردن process
```

### TypeScript Errors
```bash
# پاک کردن cache و rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Contributing

1. ایجاد branch جدید: `git checkout -b feature/my-feature`
2. Commit تغییرات: `git commit -am 'Add feature'`
3. Push به branch: `git push origin feature/my-feature`
4. ایجاد Pull Request

## Resources

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [dayjs Documentation](https://day.js.org/docs/en/installation/installation)
