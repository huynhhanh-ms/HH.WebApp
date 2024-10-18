// Import Swiper React components
import "swiper/css";
import AOS from "aos";
import "swiper/css/navigation";
// Import Swiper styles
import { useRef, useEffect } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function IntroComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setPlayback = () => {
    if (videoRef.current) videoRef.current.playbackRate = 4;
  };

  // const image = "/banner2.jpg";
  const images = ["/banner2.jpg", "/banner3.jpg", "/banner4.jpg"];

  useEffect(() => {
    setPlayback();
  }, [videoRef]);
  return (
    <div>

      <Swiper
        pagination={{
          clickable: true,
          type: "bullets",
        }}
        navigation
        modules={[Navigation]}
        className="introSwiper"
      >
        {images.map((image) => (
            <SwiperSlide className="w-full" key={image}>
              <div className="relative w-full h-[100vh] overflow-hidden">
                {/* <img
            src={image}
            alt="image"
            className="object-cover w-full h-[80vh]"
            hidden
          ></img> */}
                <img alt="" src="./background.png"
                  className="w-full transition-transform duration-500 ease-in-out hover:scale-125"
                  // data-aos="zoom-in"
                 />
                <div
                  className="flex justify-center flex-col items-center absolute left-0 right-0 top-40 text-white text-center font-serif leading-3"
                >
                  <div className="w-60 h-60 flex justify-center items-center mb-16" data-aos="flip-right">
                    <img alt="" src="/logo.png" className="w-[80%] h-[80%]" />
                  </div>
                  <div>
                    <div className="text-2xl" data-aos="fade-down" >
                      CHI NHÁNH CÔNG TY TNHH SX-DV-TM
                    </div>
                    <br />
                    <div className="text-6xl font-bold" data-aos="zoom-in">
                      TÂM NGÂN PHÁT
                    </div>
                    <br />
                    <div className="text-base" data-aos="fade-up">
                      ĐC: Tổ 9, KP.Trảng Cát, P.Hắc dịch, TX.Phú Mỹ, Tỉnh BRVT
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>

  );
}
