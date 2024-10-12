// next
// import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link, Stack, Button, AppBar, Divider, Container } from '@mui/material';
// hooks
// import { useOffSetTop, useResponsive } from '../../hooks';
// routes
// config
// components
import { makeStyles } from '@mui/styles';

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

export const useStyles = makeStyles({
  acrylicHeader: {
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Màu nền với độ trong suốt
    backdropFilter: "blur(10px)", // Hiệu ứng mờ
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Đổ bóng nhẹ
    border: "1px solid rgba(255, 255, 255, 0.2)", // Đường viền tinh tế
  },
  title: {
    flexGrow: 1,
    color: "#fff", // Màu chữ
  },
});

type Props = {
  transparent?: boolean;
};

export default function Header({ transparent }: Props) {
  const theme = useTheme();

  // const isDesktop = useResponsive('up', 'md');
  const isDesktop = true;

  const isLight = theme.palette.mode === 'light';

  // const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);
  const isScrolling = true;

  const classes = useStyles();

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
              isScrolling={isScrolling}
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

            <Divider orientation="vertical" sx={{ height: 24 }} />

            {isDesktop && (
              <Stack direction="row" spacing={1}>
                {/* <NextLink href="https://github.com/zennomi" target="_blank" rel="noopener"> */}
                  <Button
                    color="inherit"
                    variant="outlined"
                    sx={{
                      ...(transparent && {
                        color: 'common.white',
                      }),
                      ...(isScrolling && isLight && { color: 'text.primary' }),
                    }}
                  >
                    Source Code
                  </Button>
                {/* </NextLink> */}

                <Button variant="contained" href="https://www.facebook.com/Zennomi" target="_blank" rel="noopener">
                    Github
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

