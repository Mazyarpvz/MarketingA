import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  formatJalaliDate, 
  formatJalaliDateTime,
  isOverdue as checkOverdue
} from './dayjs';

export { getDaysDifference } from './dayjs';

/**
 * Helper برای ترکیب class names با Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper برای format کردن اعداد به فارسی
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

/**
 * Helper برای format کردن درصد
 */
export function formatPercent(num: number): string {
  return `${formatNumber(num)}٪`;
}

/**
 * Helper برای تبدیل تاریخ میلادی به جلالی
 */
export function toJalali(date: string | Date): string {
  return formatJalaliDate(date);
}

/**
 * Helper برای تبدیل تاریخ و زمان میلادی به جلالی
 */
export function toJalaliDateTime(date: string | Date): string {
  return formatJalaliDateTime(date);
}

/**
 * Helper برای محاسبه رنگ بر اساس درصد پیشرفت
 */
export function getProgressColor(percent: number): string {
  if (percent < 30) return 'bg-red-500';
  if (percent < 60) return 'bg-yellow-500';
  if (percent < 90) return 'bg-blue-500';
  return 'bg-green-500';
}

/**
 * Helper برای گرفتن رنگ وضعیت
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'Open': 'bg-gray-500',
    'In Progress': 'bg-blue-500',
    'Review': 'bg-purple-500',
    'On Hold': 'bg-yellow-500',
    'Blocked': 'bg-red-500',
    'Done': 'bg-green-500',
  };
  
  return statusColors[status] || 'bg-gray-500';
}

/**
 * Helper برای گرفتن متن فارسی وضعیت
 */
export function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    'Open': 'باز',
    'In Progress': 'در حال انجام',
    'Review': 'در حال بررسی',
    'On Hold': 'متوقف شده',
    'Blocked': 'مسدود شده',
    'Done': 'تکمیل شده',
  };
  
  return statusLabels[status] || status;
}

/**
 * Helper برای debounce کردن تابع
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Helper برای throttle کردن تابع
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Helper برای export کردن داده به CSV
 */
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header];
        const escaped = String(cell).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Helper برای copy کردن متن به clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Helper برای محاسبه تفاوت روزها (re-exported from dayjs module)
 */

/**
 * Helper برای چک کردن معوق بودن
 */
export function isOverdue(dueDate: string | Date): boolean {
  return checkOverdue(dueDate);
}
