import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, useMediaQuery, CssBaseline, GlobalStyles } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import theme from './common/theme';

const cache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const AppThemeProvider = ({ children }) => {
  const server = useSelector((state) => state.session.server);
  
  // اگر میخوای حتما RTL باشه این خط:
  const direction = 'rtl';

  const serverDarkMode = server?.attributes?.darkMode;
  const preferDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = serverDarkMode !== undefined ? serverDarkMode : preferDarkMode;

  const themeInstance = theme(server, darkMode, direction);

  useEffect(() => {
    document.body.setAttribute('dir', direction);
  }, [direction]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={themeInstance}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            '@font-face': [
              {
                fontFamily: 'Vazir',
                src: `url('/fonts/Vazir.woff2') format('woff2')`,
                fontWeight: 'normal',
                fontStyle: 'normal',
              },
            ],
            body: {
              fontFamily: 'Vazir, Tahoma, sans-serif',
              direction: direction,
              textAlign: 'right',
              margin: 0,
              padding: 0,
            },
          }}
        />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default AppThemeProvider;
