import 'src/global.css';

import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Fab from '@mui/material/Fab';

import { Router } from 'src/routes/router';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';

import ChatBox from './chatbot/Chatbot';
import { useChatbot } from './stores/use-chatbot';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const location = useLocation();
  // const { isChatbotOpen, setIsChatbotOpen } = useChatbot();
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);

  const chatboxButton = (
    <>
      <Fab
        size="medium"
        aria-label="Chatbot"
        onClick={() => {
          setIsChatbotOpen(!isChatbotOpen);
        }}
        sx={{
          zIndex: 9,
          right: 20,
          bottom: 20,
          width: 70,
          height: 70,
          position: 'fixed',
          color: 'common.black',
        }}
      >
        <img alt="" src="/assets/icons/chatbox.jpg" width={70} height={70} className='rounded-full object-cover' />
        {/* <Iconify width={40} height={40} icon="lucide:bot" /> */}
      </Fab>
      {isChatbotOpen && <ChatBox />}
    </>
  );

  return (
    <ThemeProvider>
      <Router />
      {(['/'].includes(location.pathname)) && chatboxButton}
    </ThemeProvider>
  );
}
