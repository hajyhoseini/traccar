/** @jsxImportSource @emotion/react */
import { keyframes } from '@emotion/react';
import { makeStyles } from 'tss-react/mui';

// انیمیشن جدید: نرم، زیبا، حرفه‌ای
const fadeZoomIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const useStyles = makeStyles()((theme) => ({
  image: {
    alignSelf: 'center',
    maxWidth: '450 px',
    maxHeight: '450 px',
    width: 'auto',
    height: 'auto',
    margin: theme.spacing(2),
    marginRight: theme.spacing(26),

    opacity: 0,
    animation: `${fadeZoomIn} 1s ease-out forwards`, // انیمیشن اعمال شده
  },
}));

const LogoImage = () => {
  const { classes } = useStyles();

  return (
    <img
      className={classes.image}
      src="/apple-touch-icon-180x180.png"
      alt="logo"
    />
  );
};

export default LogoImage;
