import type { ReactNode } from 'react';

import { lazy } from 'react';
// next
// import lazy from 'next/lazy';
import { Box, styled } from '@mui/material';

import { stylesMode } from 'src/theme/styles';

import { ProgressBar } from './header/progress-bar';
import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../config';
// import { HEADER_MOBILE_HEIGHT, HEADER_DESKTOP_HEIGHT } from '../config';
//
const Header = lazy(() => import('./header/Header'));
const HeaderSimple = lazy(() => import('./header/HeaderSimple'));
const Footer = lazy(() => import('./footer/Footer'));
const FooterSimple = lazy(() => import('./footer/FooterSimple'));

// ----------------------------------------------------------------------
export const RootStyle = styled('div')(({ theme }) => ({
  // paddingTop: HEADER_MOBILE_HEIGHT,
  [theme.breakpoints.up('md')]: {
    // paddingTop: HEADER_DESKTOP_HEIGHT,
  },
}));

type Props = {
  children: ReactNode;
  transparentHeader?: boolean;
  disabledHeader?: boolean;
  disabledFooter?: boolean;
  simpleHeader?: boolean;
  simpleFooter?: boolean;
};

export default function Layout({
  children,
  transparentHeader,
  disabledHeader,
  disabledFooter,
  simpleHeader,
  simpleFooter,
}: Props) {
  return (
    <Box sx={{
      '&::before': {
        width: 1,
        height: 1,
        zIndex: -1,
        content: "''",
        opacity: 0.05,
        position: 'fixed',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        // backgroundImage: `url(/assets/background/overlay2.jpg)`,
        backgroundImage: `url(/assets/background/overlay-1.webp)`,
        [stylesMode.dark]: { opacity: 0.08 },
      },
    }}>
      {disabledHeader ? null : (
        <ProgressBar>
          {simpleHeader ? (
            <HeaderSimple transparent={transparentHeader} />
          ) : (
            <Header transparent={transparentHeader} />
          )}
        </ProgressBar>
      )}
      {/* <Box sx={{
        height: { xs: `${HEADER_MOBILE_HEIGHT}px`, md: `${HEADER_DESKTOP_HEIGHT}px` },
      }}/> */}
      {children}

      {disabledFooter ? null : <>{simpleFooter ? <FooterSimple /> : <Footer />}</>}
    </Box>
  );
}
