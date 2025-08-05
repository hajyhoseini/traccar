import { useEffect } from 'react';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import 'dayjs/locale/fa';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

dayjs.extend(jalaliday); // افزودن پلاگین شمسی

const PersianDateProvider = ({ children }) => {
  useEffect(() => {
    // اعمال تنظیمات شمسی و فارسی به صورت پیش‌فرض
    dayjs.extend(jalaliday);     // فعال‌سازی jalaliday
dayjs.calendar('jalali');    // ست کردن حالت جلالی
dayjs.locale('fa');          // فعال‌سازی فارسی

    document.dir = 'rtl';
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fa">
      {children}
    </LocalizationProvider>
  );
};

export default PersianDateProvider;
