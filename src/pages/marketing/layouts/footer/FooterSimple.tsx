// @mui
import { Container, Typography } from '@mui/material';

import { Logo } from 'src/components/logo';
// components
// import { Logo } from '../../components';

// ----------------------------------------------------------------------

export default function FooterSimple() {
  return (
    <Container sx={{ textAlign: 'center', py: 8 }}>
      <Logo sx={{ mb: 3 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        © 2021. All rights reserved
      </Typography>
    </Container>
  );
}
