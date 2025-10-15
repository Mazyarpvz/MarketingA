import React from 'react';
import { 
  ListTodo, 
  AlertTriangle, 
  Calendar,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { KpiResponse } from '../../api/types';

interface KpiCardsProps {
  data: KpiResponse;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ data }) => {
  const cards = [
    {
      title: 'کل تسک‌ها',
      value: data.total_tasks,
      icon: ListTodo,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'در حال انجام',
      value: data.in_progress,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-500/30',
    },
    {
      title: 'عقب‌افتاده',
      value: data.overdue_count,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-500/30',
      pulse: data.overdue_count > 0,
    },
    {
      title: 'سررسید این هفته',
      value: data.due_this_week_count,
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-500/30',
    },
    {
      title: 'تکمیل شده',
      value: data.done,
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-500/30',
    },
    {
      title: 'مسدود شده',
      value: data.blocked,
      icon: XCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden ${card.bgColor} backdrop-blur-sm rounded-xl p-6 border ${card.borderColor} hover:scale-105 transition-transform duration-200`}
          >
            {card.pulse && (
              <div className="absolute top-2 right-2">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
            )}
            
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-sm font-medium text-gray-400 mb-1">{card.title}</h3>
            <p className="text-3xl font-bold">
              {card.value.toLocaleString('fa-IR')}
            </p>
            
            {/* Decorative gradient */}
            <div className={`absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-3xl`} />
          </div>
        );
      })}
    </div>
  );
};