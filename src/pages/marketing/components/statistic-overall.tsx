import { Box, Grid, Typography } from "@mui/material";

import Statistic from "./statistic";

interface Props {
  id: number;
  isMobile: boolean;
}

export function StatisticOverall({ id, isMobile }: Props) {

  return (
    <Grid container className="sm:h-[100vh] md:h-[100vh] items-center bg-white">
      <Grid item xs={12} md={7} className="flex-1 m-auto " data-aos="fade-right">
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          // width="50%"
          sx={{
            p: { xs: '50px', sm: '100px', md: '100px' },
          }}
        >
          <Typography variant="h2" className="text-gray-700" lineHeight="3rem" marginBottom={4}>
            <span className="mr-4 text-blue-900">Huynh Hạnh</span>
            <br />
            Dẫn đầu nguồn cung ứng
          </Typography>
          <Typography variant="h6" className="text-gray-700">
            Cùng các doanh nghiệp đầu mối kinh doanh cũng như các đại lý nhỏ lẻ, Chúng tôi đảm bảo cung cấp đầy đủ và kịp thời các loại nông sản cũng như vật liệu xây đầy đủ và kịp thời.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={5} className="">
        <Box className="flex flex-col gap-4 justify-center">
          <Statistic className="px-[20%]" value={10} leading='> ' title={"Loại\nmặt hàng"} titleWidth={100} body={"Cung cấp cho các đại lý, doanh nghiệp \nvới đa dạng mẫu mã và đặt hàng thiết kế, \nchỉ tiêu theo yêu cầu"} />
          <Statistic className="px-[20%]" value={50} leading='> ' title={"Đơn vị \nđại lý"} titleWidth={100} body={"Trực tiếp kinh doanh trên toàn quốc \nvới nhiều đối tác làm việc lâu dài"} />
          <Statistic className="px-[20%]" value={700} leading='> ' suffix='' title={"Tấn\nNông sản"} titleWidth={100} body={"Cung cấp mỗi năm cho \nthị trường miền tây cho việc xuất khẩu \ncũng như làm thức ăn cho gia súc"} />
        </Box>

      </Grid>
    </Grid>);
}