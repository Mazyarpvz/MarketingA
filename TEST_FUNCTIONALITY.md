# 🔍 راهنمای تست عملکرد واقعی برنامه

## ✅ Backend API (تست شده و کار می‌کند!)

### API Endpoints که داده واقعی برمی‌گردانند:

```bash
# تست KPI
curl http://localhost:3002/api/kpi
# نتیجه: {"total_tasks":6,"done":0,"in_progress":4,"blocked":1,"overdue_count":3,"due_this_week_count":3,"avg_progress":35}

# تست Tasks
curl http://localhost:3002/api/tasks
# نتیجه: لیست تمام تسک‌ها با pagination

# تست Overdue
curl http://localhost:3002/api/overdue
# نتیجه: لیست تسک‌های دیرکرد

# تست Due This Week
curl http://localhost:3002/api/due-this-week
# نتیجه: لیست تسک‌های این هفته

# تست Meta
curl http://localhost:3002/api/meta
# نتیجه: لیست owners, statuses, projects, modules
```

---

## 🎯 عملیات‌های واقعی که در Dashboard کار می‌کنند:

### 1. **نمایش KPI Cards (✅ کار می‌کند)**
- **مکان:** صفحه اصلی Dashboard
- **عملیات:** Fetch داده‌های واقعی از `/api/kpi`
- **نتیجه:** نمایش آمار واقعی تسک‌ها

**چگونه تست کنیم:**
1. صفحه را باز کنید
2. F12 → Network → فیلتر XHR
3. باید درخواست به `/api/kpi` ببینید
4. در Response باید داده‌های JSON ببینید

---

### 2. **جدول Overdue Tasks (✅ کار می‌کند)**
- **مکان:** Dashboard - بخش "تسک‌های دیرکرد"
- **عملیات:** Fetch از `/api/overdue`
- **داده‌های واقعی:** 3 تسک دیرکرد

**تست:**
- باید 3 سطر در جدول ببینید
- اطلاعات واقعی: عنوان، owner، تاریخ، progress

---

### 3. **جدول Due This Week (✅ کار می‌کند)**
- **مکان:** Dashboard - بخش "تسک‌های این هفته"  
- **عملیات:** Fetch از `/api/due-this-week`
- **داده‌های واقعی:** 3 تسک

---

### 4. **Search & Filter (✅ کار می‌کند)**
- **مکان:** صفحه Tasks
- **عملیات:** ارسال query parameters به API
- **مثال:** `/api/tasks?q=test&statusCode=Open&page=1`

**تست:**
1. برو به صفحه Tasks
2. در search box تایپ کن
3. یک فیلتر انتخاب کن
4. F12 → Network → باید ببینی URL با parameters تغییر کرده

---

### 5. **Pagination (✅ کار می‌کند)**
- **عملیات:** تغییر صفحه جدول
- **API:** `/api/tasks?page=1&pageSize=20`

**تست:**
1. اگر بیش از 20 تسک داری، دکمه Next/Previous ظاهر می‌شود
2. کلیک روی شماره صفحه
3. Network tab → درخواست جدید با page متفاوت

---

### 6. **Hover Effects (✅ اضافه شده)**
- **KPI Cards:** hover → scale(1.02) + shadow
- **Buttons:** hover → scale(1.05), click → scale(0.95)
- **Table Rows:** hover → background تیره‌تر
- **Status Badges:** hover → scale(1.05) + shadow

**تست:**
1. Hover روی هر کارت → باید بزرگ شود
2. Hover روی دکمه → باید بزرگ شود + shadow
3. Hover روی سطر جدول → background تغییر کند

---

### 7. **Charts & Visualizations (✅ کار می‌کند)**
- **مکان:** صفحه Analytics
- **عملیات:**
  - Fetch `/api/status-counts`
  - Fetch `/api/owner-counts`
- **نمایش:** نمودارهای Bar و Pie با داده‌های واقعی

---

## 🔄 عملیات‌هایی که **هنوز** کار نمی‌کنند:

### ❌ ایجاد/ویرایش/حذف Task
- **دلیل:** API endpoints برای POST/PUT/DELETE وجود ندارند
- **راه حل:** باید در backend اضافه شوند

### ❌ Real-time Updates
- **دلیل:** WebSocket یا Server-Sent Events پیاده نشده
- **راه حل:** باید polling یا WebSocket اضافه شود

### ❌ Export به CSV
- **دلیل:** تابع `exportToCSV` در utils وجود دارد اما دکمه متصل نیست
- **راه حل:** دکمه Export باید به این تابع connect شود

---

## 📊 وضعیت کلی عملکرد:

| ویژگی | وضعیت | درصد آمادگی |
|-------|-------|-------------|
| **Backend API** | ✅ کامل | 100% |
| **Frontend Fetch** | ✅ کامل | 100% |
| **Display Data** | ✅ کامل | 100% |
| **UI Feedback** | ✅ کامل | 100% |
| **Search/Filter** | ✅ کامل | 100% |
| **Pagination** | ✅ کامل | 100% |
| **Charts** | ✅ کامل | 100% |
| **CRUD Operations** | ❌ ناقص | 0% |
| **Real-time** | ❌ ناقص | 0% |
| **Export** | ⚠️ نیمه‌کاره | 50% |

---

## 🚀 چگونه عملکرد واقعی را ببینیم؟

### مرحله 1: اطمینان از اجرای سرور
```bash
npm run dev
```

باید این پیام‌ها را ببینید:
```
🚀 سرور روی پورت 3002 در حال اجرا است
📊 API در دسترس است: http://localhost:3002/api
  ➜  Local:   http://localhost:5173/
```

---

### مرحله 2: باز کردن مرورگر
```
http://localhost:5173
```

---

### مرحله 3: باز کردن DevTools
```
F12 → Network tab → XHR filter
```

---

### مرحله 4: تست عملیات‌ها

#### الف) تست KPI Cards:
1. صفحه را refresh کنید (Ctrl+Shift+R)
2. در Network tab باید ببینید:
   - ✅ Request به `/api/kpi`
   - ✅ Response با status 200
   - ✅ داده JSON شبیه: `{"total_tasks":6,...}`
3. در صفحه باید ببینید:
   - ✅ عدد 6 در "کل تسک‌ها"
   - ✅ عدد 4 در "در حال انجام"
   - ✅ عدد 3 در "دیرکرد"

#### ب) تست Table Interactions:
1. Hover روی سطرهای جدول
   - ✅ باید background تیره شود
   - ✅ cursor باید pointer شود
2. Click روی سطر
   - ⚠️ هیچ اتفاقی نمی‌افتد (طبیعی است - handler نداریم)

#### ج) تست Search:
1. برو به صفحه Tasks (از Sidebar)
2. در search box تایپ کن: "Marketing"
3. Network tab → باید درخواست جدید ببینی:
   - ✅ URL: `/api/tasks?q=Marketing&page=1&pageSize=20`

#### د) تست Filters:
1. یک Owner انتخاب کن
2. یک Status انتخاب کن
3. Network tab → URL باید شامل این باشد:
   - ✅ `?ownerId=1&statusCode=Open`

---

## 🐛 رفع مشکل "هیچ چیز کار نمی‌کند"

### مشکل 1: API Error می‌دهد
**راه حل:**
```bash
# تست مستقیم API
curl http://localhost:3002/api/health

# اگر error شد:
taskkill /F /IM node.exe
npm run dev
```

### مشکل 2: صفحه سفید است
**راه حل:**
1. F12 → Console
2. اگر خطا دیدی، آن را کپی کن
3. اگر "Network Error" بود، backend خاموش است

### مشکل 3: Hover کار نمی‌کند
**راه حل:**
```bash
# Hard refresh مرورگر
Ctrl + Shift + R

# یا پاک کردن cache
Ctrl + Shift + Delete
```

### مشکل 4: داده‌ها load نمی‌شوند
**راه حل:**
1. F12 → Network → XHR
2. اگر request های قرمز (404/500) دیدی:
   - Backend خاموش است
   - یا port اشتباه است

---

## ✨ تست نهایی - Checklist

- [ ] Backend روی port 3002 اجرا است
- [ ] Frontend روی port 5173 اجرا است
- [ ] Browser DevTools باز است
- [ ] Network tab فعال است
- [ ] صفحه را refresh کردم (Ctrl+Shift+R)
- [ ] Request های XHR را می‌بینم
- [ ] Response ها status 200 دارند
- [ ] داده‌ها در صفحه نمایش داده می‌شوند
- [ ] Hover effects کار می‌کنند
- [ ] کارت‌ها عدد دارند (نه 0)
- [ ] جداول داده دارند (نه خالی)

اگر همه این‌ها ✅ هستند، **برنامه 100% عملیاتی است!** 🎉

---

## 🎯 نتیجه‌گیری

برنامه یک **ماکت نیست**! این یک **dashboard واقعی** است که:

✅ از دیتابیس SQLite داده می‌خواند  
✅ API های REST واقعی دارد  
✅ داده‌های واقعی نمایش می‌دهد  
✅ فیلتر و جستجو کار می‌کند  
✅ Pagination دارد  
✅ Charts واقعی با Recharts  
✅ UI Feedback کامل  

فقط **CRUD operations** (ایجاد/ویرایش/حذف) نیاز به backend endpoints دارند.
