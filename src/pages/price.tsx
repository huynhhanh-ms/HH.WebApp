import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TankView } from 'src/sections/tank/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Giá bán - ${CONFIG.appName}`}</title>
      </Helmet>


      {/* <TankView /> */}
    </>
  );
}
