import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LandView } from 'src/sections/land/view';
import { UserView } from 'src/sections/user/view';
import { ScaleView } from 'src/sections/scale/view';

// ----------------------------------------------------------------------



export default function Page() {

  const handleSetTile = (input: any) => {
    console.log('clicked');
    const title = '123';
    window.electronApi.setTitle(title);
    window.electronApi.onSerialData((data) => { console.log(data) });
  }

  return (
    <>
      <Helmet>
        <title> {`Trạm cân - ${CONFIG.appName}`}</title>
      </Helmet>
      <ScaleView />
    </>
  );
}
