# 🚀 راهنمای اجرای پروژه

## وضعیت فعلی
✅ **همه چیز آماده است!** پروژه شما کاملاً کانفیگ شده و آماده اجرا است.

## تنظیمات انجام شده
- ✅ Dependencies نصب شده (409 packages)
- ✅ فایل `.env` ایجاد شد
- ✅ Database موجود و آماده (`project_dashboard.db`)
- ✅ پورت Backend به 3001 تغییر کرد (مشکل تداخل حل شد)
- ✅ Vite proxy به پورت 3001 آپدیت شد
- ✅ Backend تست شد و کار می‌کند

## اجرای پروژه

### روش 1: اجرای همزمان (توصیه می‌شود)
```bash
npm run dev
```

این دستور همزمان اجرا می‌کند:
- **Backend**: `http://localhost:3001` (API Server)
- **Frontend**: `http://localhost:5173` (React App)

### روش 2: اجرای جداگانه
Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev:web
```

## آدرس‌های مهم

| سرویس | آدرس | توضیحات |
|--------|--------|---------|
| **Frontend** | http://localhost:5173 | رابط اصلی داشبورد |
| **Backend API** | http://localhost:3001/api | REST API |
| **Health Check** | http://localhost:3001/api/health | چک سلامت سرور |
| **Demo Page** | [demo.html](./demo.html) | صفحه نمایشی |

## ویژگی‌های داشبورد

### 📊 KPI Cards
- تعداد کل تسک‌ها
- تسک‌های تکمیل شده
- تسک‌های در حال انجام
- تسک‌های مسدود شده
- تسک‌های معوق
- میانگین پیشرفت

### 📈 نمودارها
- نمودار وضعیت‌های تسک
- نمودار مالکان برتر
- تحلیل‌های آماری

### 📋 جداول
- تسک‌های معوق
- تسک‌های این هفته
- لیست کامل تسک‌ها

### 🔍 فیلترها
- فیلتر بر اساس مالک
- فیلتر بر اساس وضعیت
- فیلتر بر اساس پروژه
- فیلتر بر اساس ماژول
- جست‌وجو در عنوان و توضیحات
- فیلتر تاریخی

## تست کردن API

بعد از اجرا، می‌توانید API endpoints را تست کنید:

```bash
# Health Check
curl http://localhost:3001/api/health

# KPI Data  
curl http://localhost:3001/api/kpi

# Task Lists
curl http://localhost:3001/api/tasks
curl http://localhost:3001/api/overdue
curl http://localhost:3001/api/due-this-week

# Meta Data
curl http://localhost:3001/api/meta
```

## عیب‌یابی

### اگر Frontend load نمی‌شود:
1. مطمئن شوید هر دو سرور اجرا می‌شوند
2. چک کنید که پورت‌ها مشغول نباشند
3. مرورگر را refresh کنید

### اگر API کار نمی‌کند:
1. چک کنید Backend روی پورت 3001 اجرا شده
2. Database file موجود باشد
3. لاگ‌های console را بررسی کنید

### اگر خطای CORS دریافت کردید:
- مطمئن شوید که CORS_ORIGIN در `.env` درست تنظیم شده

## ساختار پروژه

```
project-dashboard/
├── server/                 # Backend (Node.js + Express + SQLite)
│   ├── routes/            # API endpoints
│   ├── db.ts              # Database connection
│   └── index.ts           # Main server file
├── web/                   # Frontend (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/    # React components  
│   │   ├── api/          # API client
│   │   └── pages/        # Page components
│   └── vite.config.ts    # Vite configuration
└── project_dashboard.db  # SQLite database
```

## داده‌های نمونه

پروژه شامل داده‌های نمونه است:
- 3 پروژه 
- 6 ماژول
- 3 تیم
- 5 مالک  
- 6+ تسک با وضعیت‌های مختلف

## صادرات داده

- **CSV Export**: برای جداول
- **PDF Export**: برای کل داشبورد (Print)

---

**🎉 حالا می‌توانید `npm run dev` را اجرا کنید و از داشبورد لذت ببرید!**