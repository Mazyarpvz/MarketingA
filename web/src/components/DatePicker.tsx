import React from 'react';
import { getTodayGregorian, convertGregorianToJalali } from '../lib/dayjs';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const setToday = () => {
    onChange(getTodayGregorian());
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          type="date"
          value={value}
          onChange={handleDateChange}
          className="input"
        />
        <button
          type="button"
          onClick={setToday}
          className="btn-secondary text-sm"
        >
          امروز
        </button>
      </div>
      <p className="text-xs text-slate-400">
        نمایش جلالی: {convertGregorianToJalali(value)}
      </p>
    </div>
  );
};
