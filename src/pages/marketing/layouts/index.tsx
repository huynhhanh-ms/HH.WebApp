import type { ReactNode } from 'react';

import { lazy } from 'react';
// next
// import lazy from 'next/lazy';
import { styled } from '@mui/material';

import { ProgressBar } from './header/progress-bar';
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
    <>
      {disabledHeader ? null : (
        <ProgressBar>
          {simpleHeader ? (
            <HeaderSimple transparent={transparentHeader} />
          ) : (
            <Header transparent={transparentHeader} />
          )}
        </ProgressBar>
      )}

      {children}

      {disabledFooter ? null : <>{simpleFooter ? <FooterSimple /> : <Footer />}</>}
    </>
  );
}
