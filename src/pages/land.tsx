import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LandView } from 'src/sections/land/view';
import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Đất đai - ${CONFIG.appName}`}</title>
      </Helmet>

      <LandView  />
    </>
  );
}
