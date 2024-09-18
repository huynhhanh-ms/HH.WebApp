
// import React from 'react';

const images = [
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150"
];

const InfiniteScroll = () => (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee">
        {images.map((src, index) => (
          <img key={index} src={src} alt={`img-${index}`} className="w-32 h-32 mx-2" />
        ))}
        {images.map((src, index) => (
          <img key={`duplicate-${index}`} src={src} alt={`img-duplicate-${index}`} className="w-32 h-32 mx-2" />
        ))}
      </div>
    </div>
  );

export default InfiniteScroll;
