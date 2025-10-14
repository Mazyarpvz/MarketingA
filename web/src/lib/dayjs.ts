import dayjs from 'dayjs';
import jalali from 'jalaliday';

dayjs.extend(jalali);

export const formatJalaliDate = (date: string | Date) => {
  return dayjs(date).calendar('jalali').format('jYYYY/jMM/jDD');
};

export const formatJalaliDateTime = (date: string | Date) => {
  return dayjs(date).calendar('jalali').format('jYYYY/jMM/jDD HH:mm');
};

export const getTodayJalali = () => {
  return dayjs().calendar('jalali').format('jYYYY/jMM/jDD');
};

export const getTodayGregorian = () => {
  return dayjs().format('YYYY-MM-DD');
};

export const convertJalaliToGregorian = (jalaliDate: string) => {
  const [year, month, day] = jalaliDate.split('/').map(Number);
  return dayjs().calendar('jalali').jYear(year).jMonth(month - 1).jDate(day).format('YYYY-MM-DD');
};

export const convertGregorianToJalali = (gregorianDate: string) => {
  return dayjs(gregorianDate).calendar('jalali').format('jYYYY/jMM/jDD');
};

export const getDaysDifference = (date1: string | Date, date2: string | Date): number => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);
  return d2.diff(d1, 'day');
};

export const isOverdue = (dueDate: string | Date): boolean => {
  return dayjs().isAfter(dayjs(dueDate), 'day');
};

export default dayjs;
