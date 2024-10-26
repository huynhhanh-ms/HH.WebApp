import React, { useRef, useEffect } from 'react';

import { Box, Card, Grid, Button, Typography } from '@mui/material';

const CameraFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = React.useState(false);

  useEffect(() => {
    const getCameraFeed = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (error) {
        console.error('Error accessing camera: ', error);
      }
    };

    if (isCameraActive) {
      getCameraFeed();
    }

    // Clean up function to stop the video stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        autoPlay
        playsInline
        sx={{
          width: '100%',
          // height: 'auto',
          // width: '400px',   // Cố định chiều rộng
          height: '150px',  // Cố định chiều cao
          border: '2px solid #b0d8ff',
        }}
      />
      <Grid container alignItems="stretch">
        <Grid item md={4}>
          {!isCameraActive && (
            <Button
              variant="contained"
              size='small'
              color="primary"
              onClick={() => setIsCameraActive(true)}
              sx={{ marginTop: 1 }}
            >
              Bật
            </Button>
          )}
        </Grid>
        <Grid item md={8}>
          <Card sx={{ marginTop: 1 }}>
            <Typography variant="h6" align="center">
              47H.77777
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CameraFeed;
