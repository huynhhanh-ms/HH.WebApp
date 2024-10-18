import { Grid, Typography } from "@mui/material";

export function CompanyHistory() {

  return (<>

    {/* image with title left, right */}
    <Grid container className="bg-current">
      <Grid item xs={12} md={6}>
        <img
          src="/use-brick.webp"
          alt="image_alt"
          className="object-cover h-full"
          data-aos="fade-right"
        />
      </Grid>
      <Grid item xs={12} md={6}
        className=" p-10 text-3xl"
      >
        <div className="flex items-center justify-center h-full flex-col"
          data-aos="fade-left"
        >
          <Typography variant="h2" className="py-3 text-4xl text-white md:w-3/4">
            Nền tảng của Doanh Nghiệp
          </Typography>
          <Typography variant="h6" className="text-xl text-white md:w-3/4">
            Được thành lập vào năm 2008, Công ty TNHH TM DV Huynh Hạnh đã cam kết
            cung cấp các sản phảm chất lượng hàng đầu cho khách hàng.
            <br />
            <br />
            Đó cũng là sứ mệnh và kim chỉ nam của chúng tôi trong suốt quá trình phát triển.
          </Typography>
          {/* <br />
        <a href="/shop" className="text-base underline underline-offset-8">
        Tìm hiểu thêm
        </a> */}
        </div>
      </Grid>
    </Grid>
  </>)
}