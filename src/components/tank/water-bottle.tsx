
import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';


interface pops {
  percent?: number;
  color?: string;
}

const WaterBottle = ({ percent = 50, color }: pops) => {
  const [waterLevel, setWaterLevel] = useState(percent); // Set initial water level

  const props = useSpring({
    height: `${waterLevel}%`, 
    from: { height: '0%' },
  });

  return (
    <div style={{ border: `1px solid ${color}`, height: '100px', width: '60px', position: 'relative' }} className='rounded-md'>
      <animated.div
        className="rounded-b-md"
        style={{
          ...props,
          background: color,
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
      />
      {/* <Button onClick={() => setWaterLevel(waterLevel + 10)}>Increase Water</Button> */}
    </div>
  );
};

export default WaterBottle;
