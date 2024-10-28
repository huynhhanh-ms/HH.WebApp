// next
// import NextLink from 'next/link';
// @mui
import { Box, Link, Stack, AppBar, Button, Divider, Container } from '@mui/material';
// config
// hooks
// import useOffSetTop from '../../hooks/useOffSetTop';
// routes
// import Routes from '../../routes';
// components
import { useRouter } from 'src/routes/hooks';

// import { Logo } from '../../components';
import { Logo } from 'src/components/logo';

import { ProgressBar } from './progress-bar';
//
import useOffSetTop from '../../hook/useOffSetTop';
import { HEADER_DESKTOP_HEIGHT } from '../../config';
// import LanguagePopover from '../LanguagePopover';
import { ToolbarStyle, ToolbarShadowStyle } from './HeaderToolbarStyle';

// ----------------------------------------------------------------------

type Props = {
  transparent?: boolean;
};

export default function HeaderSimple({ transparent }: Props) {
  const isScrolling = useOffSetTop(HEADER_DESKTOP_HEIGHT);

  const router = useRouter();
  const handleSignIn = (event: any) => {
    router.push('sign-in');
    document.location.reload();
  }

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle disableGutters transparent={transparent} scrolling={isScrolling} sx={{ px: 2 }}>
        <Container
          maxWidth={false}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Logo textColor={
            isScrolling ? 'text.primary' : 'white'
          } />

          <Stack
            direction="row"
            alignItems="center"
            divider={<Divider orientation="vertical" sx={{ height: 24 }} />}
            spacing={2.5}
          >
            <Button variant='text' color='inherit'
              sx={{
                fontWeight: 'fontWeightMedium',
                ...(isScrolling && { color: 'text.primary' }),
              }}
              onClick={handleSignIn}
            >
              Đăng nhập
            </Button>
          </Stack>
        </Container>
      </ToolbarStyle>

      {isScrolling && <ToolbarShadowStyle />}
    </AppBar>
  );
}
