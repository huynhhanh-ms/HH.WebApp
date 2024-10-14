import AOS from "aos";
import { useEffect } from "react";

export default function BigCategoryCard({
  title,
  item,
}: {
  title: string;
  item: {
    title: string;
    image: string;
    description: string;
  }[];
}) {
  return (
    <div className="py-10 text-2xl text-center bg-white">
      <div className="py-10 text-3xl text-center font-dejaVuSerif">{title}</div>
      <div className="flex justify-around">
        {item.map((i, index) => (
          <div key={index} className="m-12 text-left" data-aos="fade-up">
            <img
              src={i.image}
              alt="image_alt"
              className="object-cover w-full border-2 border-solid border_black h-[600px]"
            />
            <div className="my-8 font-dejaVuSerif">{i.title}</div>
            <div className="text-lg">
              {i.description}
            </div>
            {/* <div className="my-4">
              <a href="/shop" className="text-lg underline underline-offset-8">
                Radiant Necklaces
              </a>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
