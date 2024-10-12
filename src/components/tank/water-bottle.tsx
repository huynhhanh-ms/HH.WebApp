import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface Props {
  percent?: number;
  color?: string;
}

const WaterBottle = ({ percent = 50, color }: Props) => {
  const [waterLevel, setWaterLevel] = useState(percent); // Set initial water level

  useEffect (() => {
    setWaterLevel(percent);
  }, [percent]);


  return (
    <div style={{ border: `1px solid ${color}`, height: '100px', width: '60px', position: 'relative' }} className='rounded-md'>
      <motion.div
        className="rounded-b-md"
        style={{
          background: color,
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
        animate={{ height: `${waterLevel}%` }}
        initial={{ height: '0%' }}
        transition={{ duration: 0.5 }}
      />
      {/* <Button onClick={() => setWaterLevel(waterLevel + 10)}>Increase Water</Button> */}
    </div>
  );
};

export default WaterBottle;
