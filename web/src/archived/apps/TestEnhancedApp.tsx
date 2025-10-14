import React from 'react';

const TestEnhancedApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🚀 داشبورد مدیریت پروژه - نسخه تست
        </h1>
        
        {/* KPI Cards Test */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">کل تسک‌ها</h3>
            <p className="text-3xl font-bold">6</p>
          </div>
          <div className="bg-green-600 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">در حال انجام</h3>
            <p className="text-3xl font-bold">4</p>
          </div>
          <div className="bg-red-600 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">عقب‌افتاده</h3>
            <p className="text-3xl font-bold">3</p>
          </div>
        </div>

        {/* Sample Data Table */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">تسک‌های نمونه</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-right p-2">عنوان</th>
                  <th className="text-right p-2">مسئول</th>
                  <th className="text-right p-2">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="p-2">طراحی رابط کاربری فروش</td>
                  <td className="p-2">احمد محمدی</td>
                  <td className="p-2">
                    <span className="bg-yellow-600 px-2 py-1 rounded text-xs">در حال انجام</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-2">پیاده‌سازی API فروش</td>
                  <td className="p-2">فاطمه احمدی</td>
                  <td className="p-2">
                    <span className="bg-yellow-600 px-2 py-1 rounded text-xs">در حال انجام</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-2">گزارش فروش ماهانه</td>
                  <td className="p-2">احمد محمدی</td>
                  <td className="p-2">
                    <span className="bg-red-600 px-2 py-1 rounded text-xs">مسدود</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p>✅ اگر این صفحه کار می‌کند، آنگاه React و Tailwind درست کار می‌کنند</p>
        </div>
      </div>
    </div>
  );
};

export default TestEnhancedApp;