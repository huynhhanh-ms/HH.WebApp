import React from "react";

import { Typography } from "@mui/material";

import CounterNum from "./counter-num";

export default function Statistic({ value, title, body, titleWidth, leading, suffix, className}: { value: number, title: string, body: string, titleWidth: number ,leading?:string, suffix?:string, className?:string}) {
  const formatText = (text: string) => text.split('\n').map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));
  return (
    <div  className={className}>
      <div className="flex items-end"data-aos="fade-up">
        <div className="" >
          <CounterNum
            endValue={value}
            leading={leading}
            suffix={suffix}
           />
        </div>
        <Typography variant="h6"
          className="pb-1 pl-4 text-xl font-bold leading-5 text-blue"
          style={{ width: titleWidth }}
        >{formatText(title)}</Typography>
      </div>
      <Typography variant="body1"
      className="pt-2 text-sm leading-5 text-gray-800"
      >{formatText(body)}</Typography>
    </div>
  );
}