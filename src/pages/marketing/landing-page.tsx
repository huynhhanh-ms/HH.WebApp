// import BigCategoryCard from "../components/type-card";
import './index.css';
import "aos/dist/aos.css";

import AOS from "aos";
import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

import { Box, Grid, Divider, useTheme, Typography, useMediaQuery } from '@mui/material';

import { background } from 'src/theme/core';

import SerialComponent from 'src/components/scale/serial-port-test';

import Layout from "./layouts";
import Intro from './components/intro';
import Statistic from "./components/statistic";
import IntroComponent from "./components/swiper";
import { Handshake } from './components/handshake';
import GalleryCard from "./components/gallery-card";
import CompanyInfo from "./components/company-info";
import AddressInfo from './components/address-info';
import ProfileCarousel from './components/profile-carousel';
import { CompanyHistory } from './components/company-history';
import InfiniteScrollGallery from './components/infinite-image';
import { StatisticOverall } from './components/statistic-overall';

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 3000, // Animation duration
      once: false, // Whether animation should happen only once - while scrolling down
      easing: "ease-out-cubic",
    });
  }, []);

  // const handleScroll = (event: any) => {
  //   event.preventDefault();
  //   const scrollAmount = event.deltaY * 1;
  //   window.scrollBy({ top: scrollAmount, left: 0, behavior: 'smooth', });
  // };

  // useEffect(() => {
  //   window.addEventListener('wheel', handleScroll, { passive: false });
  //   return () => {
  //     window.removeEventListener('wheel', handleScroll);
  //   };
  // }, []);

  const underMedium = useMediaQuery((theme: any) => theme.breakpoints.down('md'));
  const underSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  return (
    <Layout transparentHeader simpleHeader={underMedium} simpleFooter>
      <div className="relative custom-cursor" >

        <video autoPlay loop muted
          className="object-cover w-full h-full rounded-lg shadow-lg"
          src="/assets/marketing/intro_video.mp4"
        >
          <source src="/assets/marketing/banner.png" type="video/mp4" />
          Trình duyệt không hỗ trợ video
        </video>

        <Intro />

        <StatisticOverall id={1} isMobile={underMedium} />

        <Box sx={{ paddingY: 6, backgroundColor: 'white' }} />

        <CompanyHistory />

        <Handshake />

        <ProfileCarousel slidesToShow={
          underSmall ? 1 : underMedium ? 2 : 3
        } />

        <Box sx={{ paddingY: 6 }} />

        <AddressInfo />

      </div>
      <SerialComponent />

    </Layout>
  );

}
