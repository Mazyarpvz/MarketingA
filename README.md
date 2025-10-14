# داشبورد مدیریت پروژه

یک داشبورد کامل برای مدیریت پروژه‌ها با استفاده از SQLite و React که شامل نمایش KPIها، گزارش‌ها و جداول مدیریتی است.

## ویژگی‌ها

- 📊 **KPI Cards**: نمایش کل تسک‌ها، تکمیل شده، در حال انجام، مسدود شده، معوق و میانگین پیشرفت
- 📈 **نمودارها**: نمودار میله‌ای وضعیت‌ها و مالکان برتر
- 📋 **جداول**: لیست تسک‌های معوق، تسک‌های این هفته و لیست کامل تسک‌ها
- 🔍 **فیلترها**: فیلتر بر اساس مالک، وضعیت، پروژه، ماژول و جست‌وجو
- 📅 **تاریخ جلالی**: نمایش تاریخ‌ها به صورت جلالی در UI
- 📤 **Export**: قابلیت Export CSV و PDF
- 🌐 **RTL**: رابط کاربری راست‌به‌چپ و فارسی
- 📱 **Responsive**: طراحی واکنش‌گرا برای موبایل و تبلت
- ⚡ **Performance**: بهینه‌سازی شده با indexes و caching
- 🛡️ **Error Handling**: مدیریت خطا و retry logic

## تکنولوژی‌ها

### Backend
- **Node.js** + **TypeScript** + **Express**
- **SQLite** با `better-sqlite3`
- **Zod** برای اعتبارسنجی
- **CORS** برای توسعه

### Frontend
- **React** + **Vite** + **TypeScript**
- **TailwindCSS** برای استایل
- **TanStack Query** برای مدیریت state
- **TanStack Table** برای جداول
- **Recharts** برای نمودارها
- **dayjs** + **jalaliday** برای تاریخ جلالی
- **Vazirmatn** فونت فارسی

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js 18+
- npm یا yarn

### نصب
```bash
# کلون کردن پروژه
git clone <repository-url>
cd project-dashboard

# نصب dependencies
npm install
```

### تنظیمات محیط
```bash
# کپی کردن فایل محیط
cp env.example .env

# ویرایش تنظیمات (اختیاری)
# DB_PATH=./project_dashboard.db
# PORT=3001
```

### اجرا
```bash
# اجرای همزمان frontend و backend
npm run dev

# یا اجرای جداگانه:
npm run dev:server  # Backend روی پورت 3001
npm run dev:web     # Frontend روی پورت 5173
```

## ساختار پروژه

```
project-dashboard/
├── server/                 # Backend
│   ├── routes/            # API routes
│   ├── sql/               # SQL queries
│   ├── db.ts              # Database connection
│   ├── types.ts           # TypeScript types
│   └── index.ts           # Express server
├── web/                   # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/          # API client
│   │   ├── lib/          # Utilities
│   │   └── styles/       # CSS styles
│   ├── index.html
│   └── vite.config.ts
├── package.json
└── README.md
```

## API Endpoints

### Meta Data
- `GET /api/meta` - دریافت فهرست فیلترها (مالکان، وضعیت‌ها، پروژه‌ها، ماژول‌ها)

### KPI & Statistics
- `GET /api/kpi?date=YYYY-MM-DD` - دریافت KPIها
- `GET /api/status-counts?date=YYYY-MM-DD` - تعداد هر وضعیت
- `GET /api/owner-counts?date=YYYY-MM-DD` - تعداد تسک‌های هر مالک

### Task Lists
- `GET /api/overdue?date=YYYY-MM-DD` - تسک‌های معوق
- `GET /api/due-this-week?date=YYYY-MM-DD` - تسک‌های این هفته
- `GET /api/tasks` - لیست کامل تسک‌ها با فیلترها

### Parameters
- `page` - شماره صفحه
- `pageSize` - تعداد آیتم در هر صفحه
- `q` - جست‌وجو در عنوان و توضیحات
- `ownerId` - فیلتر بر اساس مالک
- `statusCode` - فیلتر بر اساس وضعیت
- `projectId` - فیلتر بر اساس پروژه
- `moduleId` - فیلتر بر اساس ماژول
- `dateFrom` - تاریخ شروع
- `dateTo` - تاریخ پایان

## دیتابیس

### جداول اصلی
- `project` - پروژه‌ها
- `module` - ماژول‌ها
- `team` - تیم‌ها
- `owner` - مالکان تسک‌ها
- `status` - وضعیت‌های تسک
- `task` - تسک‌ها
- `task_dates` - تاریخ‌های تسک
- `task_assignment` - انتساب تسک‌ها
- `task_status_history` - تاریخچه وضعیت‌ها
- `fact_task_daily` - داده‌های روزانه

### وضعیت‌های پیش‌فرض
- Open (باز)
- In Progress (در حال انجام)
- Review (بررسی)
- On Hold (متوقف)
- Blocked (مسدود)
- Done (تکمیل)

## نمونه داده

پروژه شامل داده‌های نمونه است که شامل:
- 3 پروژه نمونه
- 6 ماژول
- 3 تیم
- 5 مالک
- 6 تسک با تاریخ‌ها و وضعیت‌های مختلف

## Export Features

### CSV Export
- جداول تسک‌های معوق، این هفته و لیست کامل
- شامل تمام فیلدهای مربوطه
- فرمت UTF-8 با جداکننده کاما

### PDF Export
- استفاده از قابلیت Print مرورگر
- استایل‌های بهینه برای چاپ
- شامل تمام بخش‌های داشبورد

## توسعه

### اضافه کردن API جدید
1. ایجاد route در `server/routes/`
2. اضافه کردن type در `server/types.ts`
3. اضافه کردن client method در `web/src/api/client.ts`
4. ایجاد React hook در `web/src/api/client.ts`

### اضافه کردن کامپوننت جدید
1. ایجاد فایل در `web/src/components/`
2. اضافه کردن import در `App.tsx`
3. استفاده از TailwindCSS برای استایل

## بهینه‌سازی‌ها

### Performance
- **Database Indexes**: indexes برای بهبود عملکرد queries
- **React Query**: caching و retry logic برای API calls
- **Responsive Design**: بهینه‌سازی برای موبایل و تبلت
- **Error Boundaries**: مدیریت خطا در frontend

### Security
- **Input Validation**: استفاده از Zod برای اعتبارسنجی
- **SQL Injection Protection**: استفاده از prepared statements
- **CORS Configuration**: تنظیم مناسب برای development

### Code Quality
- **TypeScript**: type safety کامل
- **Error Handling**: مدیریت خطا در تمام لایه‌ها
- **Logging**: logging مناسب برای debugging

## عیب‌یابی

### مشکلات رایج
1. **خطای CORS**: مطمئن شوید که backend روی پورت 3002 اجرا می‌شود
2. **خطای دیتابیس**: بررسی کنید که فایل `.env` درست تنظیم شده
3. **خطای تاریخ**: مطمئن شوید که تاریخ‌ها در فرمت میلادی ارسال می‌شوند
4. **خطای Dependencies**: `npm install` را اجرا کنید

### لاگ‌ها
- Backend: لاگ‌ها در کنسول نمایش داده می‌شوند
- Frontend: استفاده از Developer Tools مرورگر
- Database: بررسی فایل `project_dashboard.db`

## مشارکت

1. Fork کردن پروژه
2. ایجاد branch جدید (`git checkout -b feature/amazing-feature`)
3. Commit تغییرات (`git commit -m 'Add amazing feature'`)
4. Push به branch (`git push origin feature/amazing-feature`)
5. ایجاد Pull Request

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

## پشتیبانی

برای سوالات و پشتیبانی، لطفاً issue جدید ایجاد کنید.