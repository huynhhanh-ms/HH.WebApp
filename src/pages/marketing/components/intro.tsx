import React from 'react';

import { Box, Grid, Icon, Button, Container, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import ImageGroup from './image-group';

function Intro() {
  return (
    <Grid container className='h-[500px] justify-center'>
      <Grid item xs={12} lg={4} md={8} sx={{ textAlign: 'center', padding: '2rem', marginY: 'auto' }} data-aos='fade-down'>
      <Typography variant="h3" sx={{ fontWeight: 'bold'}} data-aos='fade-down'>
      Công ty TNHH TM DV
        </Typography>
        <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold', mb: 2 }} data-aos='fade-down'>
          <span style={{ color: '#00055d' }}>Huynh Hạnh</span>
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: {xs:'80%', md:'70%' }, margin: '0 auto', mb: 4 }} data-aos='fade-up'>
          Tiên phong trong chuỗi cung ứng nông sản, vật liệu xây dựng khu vực Tây Nguyên
        </Typography>
        <Button variant="outlined" style={{ borderRadius: 20 }} size='large' color="inherit" href="#" sx={{ mb: 4 }} data-aos='fade-right'>
          <Typography variant="h6">
            Hợp tác ngay
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={0} md={0} lg={4}>
      <ImageGroup />
        {/* <div className='relative w-full flex justify-center mx-auto h-full'>
          <img alt='intro' src='/assets/marketing/banner-shadow.png' style={{left:'0',right:'0', position: 'absolute' }} data-aos='fade-up' />
          <img alt='intro' src='/assets/marketing/banner-paddy.png' style={{left:'0',right:'0',  position: 'absolute' }} data-aos='fade-left' />
          <img alt='intro' src='/assets/marketing/banner-corn.png' style={{left:'0',right:'0',  position: 'absolute' }} data-aos='fade-down' />
          <img alt='intro' src='/assets/marketing/banner-brick.png' style={{left:'0',right:'0',  position: 'absolute' }} data-aos='fade-right' />
          <img alt='intro' src='/assets/marketing/banner-caffe.png' style={{left:'0',right:'0',  position: 'absolute' }} data-aos='fade-down' />
        </div> */}
      </Grid>
    </Grid>
  );
}

export default Intro;
