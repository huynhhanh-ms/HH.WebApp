import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React from 'react';
import Slider from 'react-slick';

import { Box, Avatar, Typography } from '@mui/material';


// Sample data for the profiles
const profiles = [
  {
    name: "Ông Huynh",
    role: "Giám đốc công ty",
    imageUrl: "/assets/marketing/CEO01.png",
    quote: "Khởi đầu từ tay trắng không phải là bất lợi, đó là cơ hội để chứng minh rằng bạn đủ bản lĩnh để chinh phục mọi thử thách."
  },
  {
    name: "Bà Hạnh",
    role: "Trường phòng kinh doanh",
    imageUrl: "/assets/marketing/CEO02.png",
    quote: "Thành công không chỉ đến từ một người, mà từ sự đoàn kết, quyết tâm và niềm tin lẫn nhau trên con đường chung."
  },
  {
    name: "Lariach French",
    role: "Online Teacher",
    imageUrl: "/assets/marketing/CEO03.png",
    quote: "Khởi đầu từ tay trắng không phải là bất lợi, đó là cơ hội để chứng minh rằng bạn đủ bản lĩnh để chinh phục mọi thử thách."
  },
];

interface Props {
  slidesToShow?: number;
}

const ProfileCarousel = ({ slidesToShow = 3 }: Props) => {
  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div>
      <Typography variant="h3" sx={{ textAlign: 'center', mt: '40px' }}>Đội ngũ lãnh đạo</Typography>
      <Box sx={{ width: '100%' }}>
        <Slider {...settings}>
          {profiles.map((profile, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box key={index} sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  margin: '50px',
                  padding: '40px 0',
                  borderRadius: '20px'
                }}>
                  <Avatar
                    alt={profile.name}
                    src={profile.imageUrl}

                    sx={{ width: '120px', height: '120px', margin: '0 auto', border: '2px solid blue-grey', mb: '20px' }}
                  />
                  <Typography variant="h4">{profile.name}</Typography>
                  <Typography variant="h5" color="text.secondary" gutterBottom>{profile.role}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ width: '75%' }}>&quot;{profile.quote}&quot;</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </div>
  );
};

export default ProfileCarousel;
