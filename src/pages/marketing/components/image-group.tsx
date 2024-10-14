import React from 'react';

import { Box } from '@mui/material';



const ImageGroup = () => (
  <Box sx={{ position: 'relative', width: { xs: '300px', md:'450px', lg:'600px'}, height: { xs: '250px', md:'375px',lg:'500px'} }}>
        <img
      alt='img3'
      src='/assets/marketing/banner-shadow.png'
      style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0, }}
      data-aos='fade-up'
    />
    <img
      alt='img1'
      src='/assets/marketing/banner-paddy.png'
      style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0 }}
      data-aos='fade-left'
    />
    <img
      alt='img2'
      src='/assets/marketing/banner-corn.png'
      style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0
      }}
      data-aos='fade-down'
    />
    <img
      alt='img3'
      src='/assets/marketing/banner-brick.png'
      style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0, }}
      data-aos='fade-right'
    />
        <img
      alt='img3'
      src='/assets/marketing/banner-caffe.png'
      style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0, }}
      data-aos='fade-down'
    />
  </Box>
);

export default ImageGroup;
