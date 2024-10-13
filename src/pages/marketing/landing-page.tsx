// import BigCategoryCard from "../components/type-card";
import './index.css';
import "aos/dist/aos.css";

import AOS from "aos";
import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

import Layout from "./layouts";
import Statistic from "./components/statistic";
import IntroComponent from "./components/swiper";
import GalleryCard from "./components/gallery-card";
import CompanyInfo from "./components/company-info";

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 3000, // Animation duration
      once: false, // Whether animation should happen only once - while scrolling down
      easing: "ease-out-cubic",
    });
  }, []);


  return (
    <Layout transparentHeader>
      <div className="relative custom-cursor" >
        <IntroComponent />

        {/* mau vang */}
        {/* <div className={`bg-current text-center pt-10 text-3xl`}>
        Building Materials
        <div className="p-10 text-xl">
        </div>
      </div> */}




        <div className="flex h-screen">
          <div className="flex-1 mx-32 m-auto" data-aos="fade-right">
            <div className="text-5xl font-bold leading-tight">
              <span className="mr-4 text-red-400">TÂM
              </span>
              <span className="mr-4 text-blue">NGÂN
              </span>
              <span className="mr-4 text-green-400">PHÁT
              </span>
              tự tin giữ vị trí chủ lực trên thị trường sắt thép Bà Rịa - Vũng Tàu
            </div>
            <div
              className="m-5 mt-14 text-gray-700"
            >
              Cùng các doanh nghiệp đầu mối kinh doanh sắt thép khác và hơn 120 thương nhân phân phối sắt thép, Tâm Ngân Phát bảo đảm đầy đủ và kịp thời các chủng loại sắt thép phục vụ phát triển kinh tế - xã hội, an ninh quốc phòng và nhu cầu tiêu dùng của nhân dân.
            </div>

          </div>
          <div className="flex flex-col flex-1 gap-8 m-auto">

            <Statistic value={20} title={"Đơn vị\n thành viên"} titleWidth={200} body={"Trực tiếp kinh doanh \ntrên toàn quốc"} />
            <Statistic value={100} title={"Đơn vị\n thành viên"} titleWidth={200} body={"Trực tiếp kinh doanh \ntrên toàn quốc"} />
            <Statistic value={4000} title={"Đơn vị\n thành viên"} titleWidth={200} body={"Trực tiếp kinh doanh \ntrên toàn quốc"} />

          </div>
        </div>





        {/* Infinitely Inspiring
      <BigCategoryCard
        key={1}
        title="SẢN PHẨM VÀ DỊCH VỤ"
        item={[
          {
            image: "./test_image/3-removebg-preview.png",
            title: "High-quality bricks",
            description:
              "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          },
          {
            image: "./test_image/2-removebg-preview.png",
            title: "Sand and gravel",
            description:
              "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          },
          {
            image: "./test_image/6-removebg-preview.png",
            title: "Cement",
            description:
              "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          },
        ]}
      ></BigCategoryCard> */}

        {/* image with title left, right */}
      <div className="bg-current">
        <img
          src="/use-brick.webp"
          alt="image_alt"
          className="object-cover w-[50%] h-full inline-block"
          data-aos="fade-right"
        />
        <div
          className="inline-block w-[50%] p-10 text-3xl"
          data-aos="fade-left"
        >
          <div className="m-32">
            <div className="py-3 text-4xl font-dejaVuSerif">
              Foundation of the Industry
            </div>
            <div className="text-xl text-white">
              &quot;Founded in 2008, Huynh Hanh Construction Supplies has been
              dedicated to providing top-notch building materials to our valued
              customers. Our mission is to deliver exceptional products and
              services that meet the highest standards of quality and
              reliability.&quot;
            </div>
            {/* <br />
        <a href="/shop" className="text-base underline underline-offset-8">
        Tìm hiểu thêm
        </a> */}
          </div>
        </div>
      </div>

        <div className="h-screen">
          {/* shop by category */}
          <div className="w-screen py-10 text-4xl font-bold text-center">
            Sản phẩm & Dịch vụ</div>
          {/* <InfiniteScroll></InfiniteScroll> */}
          <div className="flex justify-center m-2">
            {[
              "/test_image/1.png",
              "/test_image/2.png",
              "/test_image/1.png",
              "/test_image/2.png",
            ].map((image, index) => (
              <GalleryCard key={index} image={image} name="Grinding Side Trimmer Knife" href="" />
            ))}
          </div>
        </div>


        {/* divider */}
        <div className="py-10 text-3xl text-center bg-current">
          <div className="p-10 text-xl text-brown">
            Hãy để TÂM NGÂN PHÁT đồng hành cùng bạn qua từng công trình
            <br />
            hãy bắt đầu hành trình tạo nên sự khác biệt của riêng bạn!
          </div>
        </div>
        {/* <ServiceSection></ServiceSection> */}


        <div className="w-screen h-screen text-2xl font-bold text-center">
          <div className="p-10">
            LÃNH ĐẠO CỦA CHÚNG TÔI
          </div>
          <div className="flex items-center justify-center gap-10 align-middle" >
            {/* {[1, 2, 3].map(() => (
                <div className="text-xl">
                  <img alt="chudoanhnghiep" src="./images/chu-doanh-nghiep.png" className="w-[50%] m-auto p-4" data-aos="flip-right" />
                  <div data-aos="fade-up">
                    <div >Ông Tâm Ngân Phát</div>
                    <div className="font-light">Chủ doanh nghiệp</div>
                  </div>
                </div>
              ))
              } */}
          </div>

          <div className="p-10" />
        </div>




        <div className="flex justify-start h-screen">
          <CompanyInfo />
          <div><img src="./vietnam_map.png" alt="image_alt" className="object-cover flex-1" data-aos="fade-up" /></div>
          {/* <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1283.591380615396!2d107.08783765882824!3d10.641148279029512!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175110b7a0082d1%3A0x1ab165bdc10ea909!2zQ2jhu6MgVHLhuqNuZyBDw6F0!5e0!3m2!1svi!2s!4v1719851404456!5m2!1svi!2s"
          width="30%"
          height="800"
          style={{ border: "0" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe> */}
        </div>


        {/* <Link
        activeClass="active"
        to="section1"
        spy={true}
        smooth={true}
        duration={500} // Điều chỉnh tốc độ cuộn ở đây
      >
        Go to Section 1
      </Link>
      <Link
        activeClass="active"
        to="section2"
        spy={true}
        smooth={true}
        duration={2000}
      >
        Go to Section 2
      </Link>

      <div id="section1" className="h-screen bg-blue-500">Section 1</div>
      <div id="section2" className="h-screen bg-red-500">Section 2</div>
      <div className="h-screen bg-green-500">Section 3</div> */}

      </div>
      <iframe
        title="Google Maps Embed"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3892.6571756380413!2d108.43062897572!3d12.670468721407488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3171c29ed3e312d3%3A0x8bd995115445caf7!2zWMSDbmcgRMOizIB1IEh1eW5oIEhhzKNuaA!5e0!3m2!1svi!2s!4v1717307771347!5m2!1svi!2s"
        width="600"
        height="450"
        style={{ border: "0" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </Layout> 
  );

}
