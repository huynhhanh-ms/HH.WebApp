import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { Button, useMediaQuery } from '@mui/material';

import { useHeader } from 'src/stores/use-header';
import { useGlobal } from 'src/stores/use-global';
import { _langs, _notifications } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { navData } from '../config-nav-dashboard';
import { Searchbar } from '../components/searchbar';
import { _workspaces } from '../config-nav-workspace';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { HeaderTitle } from '../components/header-title';
import { AccountPopover } from '../components/account-popover';
import { LanguagePopover } from '../components/language-popover';
import { NotificationsPopover } from '../components/notifications-popover';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();
  const { header: headerValue } = useHeader();

  const [navOpen, setNavOpen] = useState(false);

  const layoutQuery: Breakpoint = 'lg';

  const matchDown = useMediaQuery(theme.breakpoints.up(layoutQuery));
  const { isSimpleNav, setSimpleNav } = useGlobal();

  const [fullIcon, setFullIcon] = useState("icon-park-outline:full-screen-one");

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                <MenuButton
                  onClick={() => {
                    // set simple nav or open nav in mobile
                    if (!matchDown) {
                      setNavOpen(true);
                    }
                    else {
                      setSimpleNav(!isSimpleNav);
                    }
                  }}
                  sx={{
                    ml: -1,
                    // [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <HeaderTitle
                  sx={{
                    ml: 5,
                  }}
                >{headerValue}</HeaderTitle>
                <NavMobile
                  data={navData}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                  workspaces={_workspaces}
                />
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                <Searchbar />

                {/* fullscreen and off */}
                <Button color="inherit"
                  sx={{ minWidth: 40, height: 40 }}
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen().then(() => { screen.orientation.unlock(); });
                      setFullIcon("icon-park-outline:full-screen-one");
                    } else {
                      document.documentElement.requestFullscreen().then(() => { (screen.orientation as any).lock('landscape'); });
                      setFullIcon("icon-park-outline:off-screen-one");
                    }
                  }} > <Icon icon={fullIcon} width="20" height="20" style={{ color: "#454545" }} /> </Button>

                <Button color='inherit'
                  sx={{ minWidth: 40, height: 40 }}

                  onClick={() => {
                    // window.location.reload();
                    // window.location.href = window.location.href;
                    window.location.reload();

                  }}
                >
                  <Icon icon='mdi:reload' width="20" height="20" style={{ color: "#454545" }} />
                </Button>

                {/* <LanguagePopover data={_langs} /> */}
                <NotificationsPopover data={_notifications} />
                <AccountPopover
                  data={[
                    {
                      label: 'Home',
                      href: '/',
                      icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
                    },
                    {
                      label: 'Profile',
                      href: '#',
                      icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
                    },
                    {
                      label: 'Settings',
                      href: '#',
                      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                    },
                  ]}
                />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop data={navData} layoutQuery={layoutQuery} workspaces={_workspaces} disabled={isSimpleNav} />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(3),
        '--layout-dashboard-content-px': theme.spacing(3),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: !isSimpleNav ? 'var(--layout-nav-vertical-width)' : '0px',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
