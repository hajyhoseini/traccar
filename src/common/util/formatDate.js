import dayjs from 'dayjs';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);
dayjs.calendar('jalali');
dayjs.locale('fa');

// تبدیل تاریخ به شمسی با فرمت کامل
export const formatPersianDateTime = (date) => {
  return dayjs(date).calendar('jalali').locale('fa').format('YYYY/MM/DD HH:mm:ss');
};

// فقط تاریخ
export const formatPersianDate = (date) => {
  return dayjs(date).calendar('jalali').locale('fa').format('YYYY/MM/DD');
};

// فقط ساعت
export const formatTime = (date) => {
  return dayjs(date).format('HH:mm:ss');
};
