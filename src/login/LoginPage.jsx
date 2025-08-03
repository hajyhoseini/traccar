import { useEffect, useState } from 'react';
import {
  useMediaQuery, Select, MenuItem, FormControl, Button, TextField, Link, Snackbar, IconButton, Tooltip, Box,
} from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';
import {
  generateLoginToken, handleLoginTokenListeners, nativeEnvironment, nativePostMessage,
} from '../common/components/NativeInterface';
// حذف import LogoImage چون استفاده نمیشه
import { useCatch } from '../reactHelper';
import QrCodeDialog from '../common/components/QrCodeDialog';
import fetchOrThrow from '../common/util/fetchOrThrow';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PasswordIcon from '@mui/icons-material/Password'; // برای TOTP (کد امنیتی)
import InputAdornment from '@mui/material/InputAdornment';

const useStyles = makeStyles()((theme) => ({
  options: {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  extraContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  registerButton: {
    minWidth: 'unset',
  },
  link: {
    cursor: 'pointer',
  },
}));

const LoginPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLocalLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], country: values[1].country, name: values[1].name }));

  const [failed, setFailed] = useState(false);
const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showServerTooltip, setShowServerTooltip] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const languageEnabled = useSelector((state) => {
    const attributes = state.session.server.attributes;
    return !attributes.language && !attributes['ui.disableLoginLanguage'];
  });
  const changeEnabled = useSelector((state) => !state.session.server.attributes.disableChange);
  const emailEnabled = useSelector((state) => state.session.server.emailEnabled);
  const openIdEnabled = useSelector((state) => state.session.server.openIdEnabled);
  const openIdForced = useSelector((state) => state.session.server.openIdEnabled && state.session.server.openIdForce);
  const [codeEnabled, setCodeEnabled] = useState(false);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector((state) => state.session.server.announcement);

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setFailed(false);
    try {
      const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(code.length ? `${query}&code=${code}` : query),
      });
      if (response.ok) {
        const user = await response.json();
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        const target = window.sessionStorage.getItem('postLogin') || '/';
        window.sessionStorage.removeItem('postLogin');
        navigate(target, { replace: true });
      } else if (response.status === 401 && response.headers.get('WWW-Authenticate') === 'TOTP') {
        setCodeEnabled(true);
      } else {
        throw Error(await response.text());
      }
    } catch {
      setFailed(true);
      setPassword('');
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetchOrThrow(`/api/session?token=${encodeURIComponent(token)}`);
    const user = await response.json();
    dispatch(sessionActions.updateUser(user));
    navigate('/');
  });

  const handleOpenIdLogin = () => {
    document.location = '/api/session/openid/auth';
  };

  useEffect(() => nativePostMessage('authentication'), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem('hostname') !== window.location.hostname) {
      window.localStorage.setItem('hostname', window.location.hostname);
      setShowServerTooltip(true);
    }
  }, []);

  return (
    <LoginLayout>
      <div className={classes.options}>
        {nativeEnvironment && changeEnabled && (
          <IconButton color="primary" onClick={() => navigate('/change-server')}>
            <Tooltip
              title={`${t('settingsServer')}: ${window.location.hostname}`}
              open={showServerTooltip}
              arrow
            >
              <VpnLockIcon />
            </Tooltip>
          </IconButton>
        )}
        {!nativeEnvironment && (
          <IconButton color="primary" onClick={() => setShowQr(true)}>
            <QrCode2Icon />
          </IconButton>
        )}
        {languageEnabled && (
          <FormControl>
            <Select value={language} onChange={(e) => setLocalLanguage(e.target.value)}>
              {languageList.map((it) => (
                <MenuItem key={it.code} value={it.code}>
                  <Box component="span" sx={{ mr: 1 }}>
                    <ReactCountryFlag countryCode={it.country} svg />
                  </Box>
                  {it.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      <div className={classes.container}>
        {/* نمایش SVG برای موبایل */}
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <svg
              viewBox="0 0 800 150"
              width="100%"
              height="150"
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@700&display=swap');
                  .brand-text {
                    font-family: 'Vazirmatn', sans-serif;
                    font-size: 48px;
                    fill: url(#gradient);
                    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                    animation: fadeIn 5s ease forwards;
                    opacity: 0;
                  }
                  @media (max-width: 600px) {
                    .brand-text {
                      font-size: 60px;
                    }
                  }
                  @keyframes fadeIn {
                    to { opacity: 1; }
                  }
                `}
              </style>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1976d2" />
                  <stop offset="100%" stopColor="#1976d2" />
                </linearGradient>
              </defs>

              <rect
                x="20"
                y="10"
                width="760"
                height="120"
                rx="20"
                ry="20"
                fill="none"
                stroke="#1976d2"
                strokeWidth="4"
                opacity="0.7"
              />
              <text
                x="400"
                y="80"
                textAnchor="middle"
                className="brand-text"
                direction="rtl"
              >
                راه کار توسعه فناورانه هوشمند
              </text>
            </svg>
          </Box>
        )}

        {/* نمایش SVG برای لپ‌تاپ */}
        {isLargeScreen && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <svg
              viewBox="0 0 800 150"
              width="80%"
              height="180"
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@700&display=swap');
                  .brand-text {
                    font-family: 'Vazirmatn', sans-serif;
                    font-size: 54px;
                    fill: url(#gradient);
                    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                    animation: fadeIn 5s ease forwards;
                    opacity: 0;
                  }
                  @keyframes fadeIn {
                    to { opacity: 1; }
                  }
                `}
              </style>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1976d2" />
                  <stop offset="100%" stopColor="#1976d2" />
                </linearGradient>
              </defs>

              <rect
                x="20"
                y="10"
                width="760"
                height="130"
                rx="20"
                ry="20"
                fill="none"
                stroke="#1976d2"
                strokeWidth="4"
                opacity="0.7"
              />
           <text
  x="400"
  y="90"
  textAnchor="middle"
  className="brand-text"
  direction="rtl"
  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
>
  توسعه راهکارهای فناورانه
</text>

            </svg>
          </Box>
        )}


        
        {!openIdForced && (
          <>
            <TextField
              required
              error={failed}
              name="email"
              value={email}
              placeholder="ایمیل"
              autoComplete="email"
              autoFocus={!email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={failed && 'نام کاربری یا رمز اشتباه است'}
              dir="rtl"
              InputProps={{
                sx: { textAlign: 'right', fontFamily: 'Vazir' },
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              fullWidth
            />

            <TextField
              required
              error={failed}
              name="password"
              type="password"
              value={password}
              placeholder="رمز عبور"
              autoComplete="current-password"
              autoFocus={!!email}
              onChange={(e) => setPassword(e.target.value)}
              dir="rtl"
              InputProps={{
                sx: { textAlign: 'right', fontFamily: 'Vazir' },
                endAdornment: (
                  <InputAdornment position="end">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              fullWidth
            />

            {codeEnabled && (
              <TextField
                required
                error={failed}
                name="code"
                value={code}
                type="number"
                placeholder="کد امنیتی"
                onChange={(e) => setCode(e.target.value)}
                dir="rtl"
                InputProps={{
                  sx: { textAlign: 'right', fontFamily: 'Vazir' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <PasswordIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                fullWidth
              />
            )}

            <Button
              onClick={handlePasswordLogin}
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: '#1976d2',
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: 'Vazir',
                fontSize: '0.9rem',
                paddingY: 1.5,
                '&:hover': {
                  backgroundColor: '#115293',
                },
              }}
              disabled={!email || !password || (codeEnabled && !code)}
            >
              {t('loginLogin')}
            </Button>
          </>
        )}
        {openIdEnabled && (
          <Button
            onClick={() => handleOpenIdLogin()}
            variant="contained"
            color="secondary"
          >
            {t('loginOpenId')}
          </Button>
        )}
        {!openIdForced && (
          <div className={classes.extraContainer}>
            {registrationEnabled && (
              <Link
                onClick={() => navigate('/register')}
                className={classes.link}
                underline="none"
                variant="caption"
              >
                {t('loginRegister')}
              </Link>
            )}
            {emailEnabled && (
              <Link
                onClick={() => navigate('/reset-password')}
                className={classes.link}
                underline="none"
                variant="caption"
              >
                {t('loginReset')}
              </Link>
            )}
          </div>
        )}
      </div>
      <QrCodeDialog open={showQr} onClose={() => setShowQr(false)} />
      <Snackbar
        open={!!announcement && !announcementShown}
        message={announcement}
        action={(
          <IconButton size="small" color="inherit" onClick={() => setAnnouncementShown(true)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      />
    </LoginLayout>
  );
};

export default LoginPage;
