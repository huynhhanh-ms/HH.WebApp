import 'src/global.css';

import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Fab from '@mui/material/Fab';
import { Box } from '@mui/material';

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
      <Fab aria-label="Chatbot" onClick={() => { setIsChatbotOpen(!isChatbotOpen); }}
        sx={{
          zIndex: 9,
          right: 20,
          bottom: 20,
          width: {
            xs: 50, 
            md: 70,  
          },
          height: 'auto',
          position: 'fixed',
        }}
      >
        <Box component="img" alt="" src="/assets/icons/chatbox.jpg" className='rounded-full object-cover'
        />
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
