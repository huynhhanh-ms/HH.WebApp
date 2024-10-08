import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SessionView } from 'src/sections/session/view';
import { SessionDetailView } from 'src/sections/session-detail/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Chốt sổ - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <SessionDetailView />
    </>
  );
}