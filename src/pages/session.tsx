import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SessionView } from 'src/sections/session/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Chốt sổ - ${CONFIG.appName}`}</title>
      </Helmet>

      <SessionView />
    </>
  );
}
