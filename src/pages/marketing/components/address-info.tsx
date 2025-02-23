import React from 'react';

import { Box, Link, Card, Grid, Button, Typography, CardHeader, CardContent, CardActions } from '@mui/material';

const AddressInfo = () => (
  <Grid container sx={{ padding: 2 }}>
    <Grid item xs={12} md={6}>
      {/* Bản đồ */}
      {/* <MapComponent /> */}
      <iframe
        title="Google Maps Embed"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3892.6571756380413!2d108.43062897572!3d12.670468721407488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3171c29ed3e312d3%3A0x8bd995115445caf7!2zWMSDbmcgRMOizIB1IEh1eW5oIEhhzKNuaA!5e0!3m2!1svi!2s!4v1717307771347!5m2!1svi!2s"
        width="100%"
        height="450"
        style={{ border: "0" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </Grid>
    <Grid item xs={12} md={6} alignContent="center" justifyContent="center">

      <Card sx={{ minHeight: '400px', marginY: '20px', marginX: '10px' }}>
        <CardHeader title=" CTY TNHH TM DV Huynh Hạnh " />
        <CardContent sx={{ padding: 4 }}>
          <Typography variant="h6" gutterBottom>
            <strong>Địa chỉ:</strong> 69 Thăng Quý, Vụ Bổn, Krông Pắc, Đắk Lắk, Việt Nam
          </Typography>
          <Typography variant="h6" gutterBottom>
            <strong>Số điện thoại:</strong> <Link href="tel:0903525647">0903525647</Link>
          </Typography>
          <Typography variant="h6" gutterBottom>
            <strong>Email:</strong> <Link href="mailto:huynhhanh718@gmail.com">huynhhanh718@gmail.com</Link>
          </Typography>
          <Typography variant="h6" gutterBottom>
            <strong>Giờ làm việc:</strong> Thứ Hai - Chủ Nhật, 07:00 - 21:00
          </Typography>
          <Typography variant="h6" gutterBottom>
            <strong>Mô tả:</strong> Chuyên nông sản và vật liệu xây dựng.
          </Typography>
          <CardActions>
            <Link href="https://www.google.com/maps?ll=12.670464,108.433204&z=16&t=m&hl=vi&gl=US&mapclient=embed&cid=10077249542879038199" target="_blank" rel="noopener noreferrer">
              <Button variant="contained" color="primary">
                Xem trên Google Maps
              </Button>
            </Link>
          </CardActions>
        </CardContent>
      </Card>
    </Grid>
  </Grid >
);

export default AddressInfo;
