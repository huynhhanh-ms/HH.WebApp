// next
// import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link, Stack, Button, AppBar, Divider, Container } from '@mui/material';
// hooks
// import { useOffSetTop, useResponsive } from '../../hooks';
// routes
// config
import { Icon } from '@iconify/react';

// components
import { makeStyles } from '@mui/styles';

import { useRouter } from 'src/routes/hooks';

// import { Logo, Label } from '../../components';
import { Logo } from 'src/components/logo';
import { Label } from 'src/components/label';

import { navConfig, NavDesktop } from '../nav';
//
import useOffSetTop from '../../hook/useOffSetTop';
import { HEADER_DESKTOP_HEIGHT } from '../../config';
// import { NavMobile, navConfig, NavDesktop } from '../nav';
import { ToolbarStyle, ToolbarShadowStyle } from './HeaderToolbarStyle';

// ----------------------------------------------------------------------

type Props = {
  transparent?: boolean;
};

export default function Header({ transparent }: Props) {
  const theme = useTheme();

  // const isDesktop = useResponsive('up', 'md');
  const isDesktop = true;

  const isLight = theme.palette.mode === 'light';

  const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);

  const router = useRouter();
  const handleGotoSignIn = (event: any): void => {
    event.preventDefault();
    router.push('/sign-in');
  }

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }} >
      <ToolbarStyle disableGutters transparent={transparent} scrolling={isScrolling}>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Box sx={{ lineHeight: 0, position: 'relative' }}>
            <Logo />

            <Link href="https://zone-docs.vercel.app/changelog" target="_blank" rel="noopener">
              <Label
                color="info"
                sx={{
                  ml: 0.5,
                  px: 0.5,
                  top: -14,
                  left: 64,
                  height: 20,
                  fontSize: 11,
                  cursor: 'pointer',
                  position: 'absolute',
                }}
              >
                Công ty TNHH TM DV
              </Label>
            </Link>
          </Box>

          {isDesktop && (
            <NavDesktop
              // isScrolling={isScrolling}
              isScrolling
              isTransparent={transparent}
              navConfig={navConfig}
            />
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Stack spacing={2} direction="row" alignItems="center">
            {/* <Searchbar
              sx={{
                ...(isScrolling && { color: 'text.primary' }),
              }}
            /> */}
            {/* 
            <LanguagePopover
              sx={{
                ...(isScrolling && { color: 'text.primary' }),
              }}
            /> */}

            <Button variant="text" href="https://www.github.com/jinergenkai" target="_blank" rel="noopener" sx={{ color: 'common.black' }} size='small'>
              Github
            </Button>

            {isDesktop && (
              <Stack direction="row" spacing={1}>
                <Button
                  color="inherit"
                  variant="contained"
                  sx={{
                    ...(transparent && {
                      color: 'common.white',
                    }),
                    ...(isScrolling && isLight && { visibility: 'hidden' }),
                  }}
                  size='small'
                  onClick={handleGotoSignIn}
                >
                  Đăng nhập
                </Button>

              </Stack>
            )}
          </Stack>

          {/* {!isDesktop && (
            <NavMobile
              navConfig={navConfig}
              sx={{
                ml: 1,
                ...(isScrolling && { color: 'text.primary' }),
              }}
            />
          )} */}
        </Container>
      </ToolbarStyle>

      {isScrolling && <ToolbarShadowStyle />}
    </AppBar>
  );
}

