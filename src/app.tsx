import 'src/global.css';

import Fab from '@mui/material/Fab';

import { Router } from 'src/routes/router';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  const githubButton = (
    <Fab
      size="medium"
      aria-label="Github"
      target="_blank"
      href="https://github.com/jinergenkai"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'common.white',
      }}
    >
      <Iconify width={24} icon="eva:github-fill" />
    </Fab>
  );

  const chatboxButton = (
    <Fab
      size="medium"
      aria-label="Chatbox"
      onClick={() => {
        alert('Xin chào, bạn cần hỗ trợ gì?');
      }}
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        position: 'fixed',
        color: 'common.white',
      }}
    >
      <img alt="" src="/assets/icons/chatbox.jpg" width={45} height={45} className='rounded-full object-cover'/>
    </Fab>
  );

  return (
    <ThemeProvider>
      <Router />
      {chatboxButton}
    </ThemeProvider>
  );
}
