import { Box, Typography } from "@mui/material";

export function Handshake({enableImage = false} : {enableImage?: boolean}) {
  return (
    <>
      <Typography variant='h6' className="py-20 px-6 text-xl text-brown text-center bg-white">
        Để chúng tôi đồng hành cùng bạn qua từng công trình
        <br />
        Hãy bắt đầu hành trình tạo nên sự khác biệt của riêng bạn!
      </Typography>
      {enableImage && <Box
        sx={{
          height: '50vh', // Chiều cao toàn bộ viewport
          position: 'relative', // Thiết lập vị trí tương đối
          bgcolor: 'lightgray', // Màu nền chính
        }}
      >
        {/* Nội dung ở trên */}
        {/* <div className="py-10"> */}
        <Typography variant='h6' className="p-10 text-xl text-brown text-center">
          Để chúng tôi
          đồng hành cùng bạn qua từng công trình
          <br />
          Hãy bắt đầu hành trình tạo nên sự khác biệt của riêng bạn!
        </Typography>
        {/* </div> */}
        {/* Background ở dưới cùng */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0, // Gắn background vào dưới cùng
            left: 0,
            right: 0,
            height: '100px', // Chiều cao của background
            backgroundSize: 'cover', // Đảm bảo hình ảnh phủ đầy
            backgroundPosition: 'center', // Căn giữa hình ảnh
            backgroundRepeat: 'no-repeat', // Không lặp lại hình ảnh
            backgroundImage: 'url(/public/assets/marketing/shakehand.png)',
          }}
        />
      </Box>}

    </>
  );
}