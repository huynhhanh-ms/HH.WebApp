import { useState, useEffect } from "react";

import NavItem from "./nav-item";

export default function Header() {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    console.log(headerVisible);
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      
      // when scroll down
      // if (scrollTop > lastScrollTop) {

      // when top
      if (scrollTop > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headerVisible, lastScrollTop]);
  return (
    <div
      className={`p-2 fixed z-50 w-full text-black transition duration-100 bg-current border-current
      ${!headerVisible ? "transform -translate-y-full" : ""}
      `}
    >
      <div className="flex items-center justify-between font-medium text-white align-middle font-montserrat ">
          <div className="w-12 h-12 mx-2 flex justify-center items-center">


            <img alt="" src="./logo.png" className="w-[80%] h-[80%]" />
          </div>
          <div className="top-0 flex-1 w-full text-2xl transform font-manhattan">
            TAM NGAN PHAT
          </div>
          <div>
            <NavItem href="/">Trang Chủ</NavItem>
            <NavItem href="/">Sản phẩm</NavItem>
            <NavItem href="/">Về chúng tôi</NavItem>
          </div>
        {/* <img src="/logo.png" alt="logo" className="h-[80px] w-[80px]" /> */}
      </div>
    </div>
  );
}
