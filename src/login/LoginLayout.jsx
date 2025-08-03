import { useMediaQuery, Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import LogoImage from './LogoImage';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #7b1fa2, #512da8)', // گرادیانت بنفش
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4, 2), // فاصله از اطراف
  },
  sidebar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
    paddingBottom: theme.spacing(5),
    width: theme.dimensions.sidebarWidth,
    [theme.breakpoints.down('lg')]: {
      width: theme.dimensions.sidebarWidthTablet,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    minHeight: '60vh',
    backdropFilter: 'blur(10px)', // 💫 افکت بلر
    backgroundColor: 'rgba(255, 255, 255, 0.75)', // نیمه‌شفاف برای بلر
    borderRadius: theme.spacing(3),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
    padding: theme.spacing(4),
    margin: theme.spacing(4, 2), // فاصله بالا پایین کمتر شد
  },
  form: {
    width: '100%',
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();
  const theme = useTheme();

  return (
    <main className={classes.root}>
      <div className={classes.sidebar}>
        {!useMediaQuery(theme.breakpoints.down('lg')) && (
          <LogoImage color={theme.palette.secondary.contrastText} />
        )}
      </div>
      <Paper className={classes.paper} elevation={0}>
        <form className={classes.form}>
          {children}
        </form>
      </Paper>
    </main>
  );
};

export default LoginLayout;
