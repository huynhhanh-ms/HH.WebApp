// @mui
import { Divider, Container, Typography } from '@mui/material';

import { Logo } from 'src/components/logo';
// components
// import { Logo } from '../../components';

// ----------------------------------------------------------------------

export default function FooterSimple() {
  return (
    <Container sx={{ textAlign: 'center', py: 8 }}>
      <Divider sx={{marginY:'20px'}}/>
      <Logo />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        © 2024. All rights reserved
      </Typography>
    </Container>
  );
}
