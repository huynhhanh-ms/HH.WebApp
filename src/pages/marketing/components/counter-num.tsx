import CountUp from 'react-countup';
import { useState, useEffect } from 'react';
// import { useInView } from "react-intersection-observer";

const CounterNum = ({ endValue }: { endValue: number }) => {
  const [start, setStart] = useState(0);

  useEffect(() => {
    setStart(1);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="font-extrabold text-7xl text-blue">
        {start && <CountUp
        // enableScrollSpy
        // scrollSpyOnce={true}
        start={0} end={endValue ?? 0} duration={8} />}
      </div>
    </div>
  );
};

export default CounterNum;
