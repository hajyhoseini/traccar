// src/theme.js یا theme/index.js
import { createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';

// تم RTL با فونت B Yekan
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'B Yekan',
  },
});

export const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default theme;
