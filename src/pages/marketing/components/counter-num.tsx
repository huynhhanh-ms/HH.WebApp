import CountUp from 'react-countup';
import { useState, useEffect } from 'react';
// import { useInView } from "react-intersection-observer";

interface CounterNumProps {
  endValue: number
  leading?: string
  suffix?: string
}

const CounterNum = ({ endValue, leading, suffix }: CounterNumProps) => {
  const [start, setStart] = useState(0);

  useEffect(() => {
    setStart(1);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="font-bold text-7xl text-blue-700">
        {leading}
        {start && <CountUp
          // enableScrollSpy
          // scrollSpyOnce={true}
          start={0} end={endValue ?? 0} duration={8} />}
        {suffix}
      </div>
    </div>
  );
};

export default CounterNum;
