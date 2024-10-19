import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LandView } from 'src/sections/land/view';
import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------



export default function Page() {

  const handleSetTile = (input:any) => {
    console.log('clicked');
    const title = '123';
    window.electronApi.setTitle(title);
  }

  return (
    <>
      <Helmet>
        <title> {`Trạm cân - ${CONFIG.appName}`}</title>
      </Helmet>


      <body>
        <h1>Hello World!</h1>

        We are using Node.js <span id="node-version" />, Chromium <span id="chrome-version" />, Electron <span id="electron-version" />, and Serialport <span id="serialport-version" />

        <div id="error" />
        <div id="ports" />
      </body>

      Title: <input id="title"/>
      <button id="btn" type="button" onClick={handleSetTile}>Set</button>

      {/* <script src="src/desktop/renderer.js" /> */}
      
      {/* <ScaleView  /> */}
    </>
  );
}
