import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import ChatView from 'src/sections/chat/view/chat-view';

// import { ChatView } from 'src/sections/chat/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Hội Thoại - ${CONFIG.appName}`}</title>
      </Helmet>

      <ChatView  />
    </>
  );
}
