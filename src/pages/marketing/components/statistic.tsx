import React from "react";

import CounterNum from "./counter-num";

export default function Statistic({ value, title, body, titleWidth }: { value: number, title: string, body: string, titleWidth: number }) {
  const formatText = (text: string) => text.split('\n').map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));
  return (
    <div data-aos="fade-up" className="">
      <div className="flex items-end">
        <div className="" >
          <CounterNum
            endValue={value}
           />
        </div>
        <div
          className="pb-1 pl-4 text-xl font-bold leading-5 text-blue"
          style={{ width: titleWidth }}
        >{formatText(title)}</div>
      </div>
      <div
      className="pt-2 text-sm leading-5 text-gray-800"
      >{formatText(body)}</div>
    </div>
  );
}