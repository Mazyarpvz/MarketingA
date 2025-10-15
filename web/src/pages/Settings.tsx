import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database, Globe, Save, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });

  const handleSave = () => {
    toast.success('تغییرات با موفقیت ذخیره شد', {
      icon: '✅',
      duration: 3000,
    });
  };

  const handleCancel = () => {
    toast.error('تغییرات لغو شد', {
      icon: 'ℹ️',
      duration: 2000,
    });
  };

  const handleNotificationToggle = (type: 'email' | 'push' | 'sms', value: boolean) => {
    setNotifications({ ...notifications, [type]: value });
    const label = type === 'email' ? 'ایمیل' : type === 'push' ? 'Push' : 'SMS';
    if (value) {
      toast.success(`اعلان‌های ${label} فعال شد`, { icon: '🔔', duration: 2000 });
    } else {
      toast.error(`اعلان‌های ${label} غیرفعال شد`, { icon: '🔕', duration: 2000 });
    }
  };

  const tabs = [
    { id: 'profile', label: 'پروفایل', icon: User },
    { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
    { id: 'security', label: 'امنیت', icon: Shield },
    { id: 'appearance', label: 'ظاهر', icon: Palette },
    { id: 'data', label: 'داده‌ها', icon: Database },
    { id: 'system', label: 'سیستم', icon: Globe },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">مازیار احمدی</h3>
                <p className="text-gray-400">مدیر پروژه</p>
                <button 
                  onClick={() => toast.success('قابلیت تغییر عکس به زودی اضافه می‌شود', { icon: '📷', duration: 2000 })}
                  className="mt-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-colors"
                >
                  تغییر عکس
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نام</label>
                <input 
                  type="text" 
                  defaultValue="مازیار" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">نام خانوادگی</label>
                <input 
                  type="text" 
                  defaultValue="احمدی" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ایمیل</label>
                <input 
                  type="email" 
                  defaultValue="mazyar@example.com" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">شماره تلفن</label>
                <input 
                  type="tel" 
                  defaultValue="09123456789" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">تنظیمات اعلان‌ها</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium text-white">اعلان‌های ایمیل</p>
                    <p className="text-sm text-gray-400">دریافت اعلان‌ها از طریق ایمیل</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.email}
                    onChange={(e) => handleNotificationToggle('email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-medium text-white">اعلان‌های Push</p>
                    <p className="text-sm text-gray-400">دریافت اعلان‌ها در مرورگر</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.push}
                    onChange={(e) => handleNotificationToggle('push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-white">اعلان‌های SMS</p>
                    <p className="text-sm text-gray-400">دریافت اعلان‌ها از طریق پیامک</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.sms}
                    onChange={(e) => handleNotificationToggle('sms', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">امنیت حساب</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h4 className="font-medium text-white mb-2">تغییر رمز عبور</h4>
                <div className="space-y-3">
                  <input 
                    type="password" 
                    placeholder="رمز عبور فعلی" 
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                  <input 
                    type="password" 
                    placeholder="رمز عبور جدید" 
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                  <input 
                    type="password" 
                    placeholder="تکرار رمز عبور جدید" 
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                  <button 
                    onClick={() => toast.success('رمز عبور با موفقیت تغییر کرد', { icon: '🔐', duration: 2000 })}
                    className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    تغییر رمز عبور
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h4 className="font-medium text-white mb-2">احراز هویت دو مرحله‌ای</h4>
                <p className="text-sm text-gray-400 mb-3">برای امنیت بیشتر حساب خود</p>
                <button 
                  onClick={() => toast.success('احراز هویت دو مرحله‌ای فعال شد', { icon: '🔒', duration: 2000 })}
                  className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                >
                  فعال‌سازی 2FA
                </button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">تنظیمات ظاهر</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h4 className="font-medium text-white mb-3">تم</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => toast.success('تم تیره انتخاب شد', { icon: '🌙', duration: 2000 })}
                    className="p-3 bg-gray-900 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className="w-full h-8 bg-gray-800 rounded mb-2"></div>
                    <p className="text-sm text-gray-300">تیره</p>
                  </button>
                  <button 
                    onClick={() => toast.success('تم روشن انتخاب شد', { icon: '☀️', duration: 2000 })}
                    className="p-3 bg-white border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className="w-full h-8 bg-gray-100 rounded mb-2"></div>
                    <p className="text-sm text-gray-700">روشن</p>
                  </button>
                  <button 
                    onClick={() => toast.success('تم خودکار انتخاب شد', { icon: '🔄', duration: 2000 })}
                    className="p-3 bg-gray-800 border border-gray-600 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className="w-full h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                    <p className="text-sm text-gray-300">خودکار</p>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h4 className="font-medium text-white mb-3">زبان</h4>
                <select 
                  onChange={(e) => {
                    const lang = e.target.value === 'fa' ? 'فارسی' : 'English';
                    toast.success(`زبان به ${lang} تغییر کرد`, { icon: '🌐', duration: 2000 });
                  }}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="fa">فارسی</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">تنظیمات {tabs.find(t => t.id === activeTab)?.label}</h3>
            <p className="text-gray-400">این بخش در حال توسعه است</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        icon={SettingsIcon}
        title="تنظیمات"
        subtitle="مدیریت تنظیمات حساب و سیستم"
        actions={
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            ذخیره همه تغییرات
          </button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-6">
            {renderTabContent()}
            
            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  لغو
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
