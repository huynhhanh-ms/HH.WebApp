/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";

import { useScaleSetting } from "src/stores/use-scale-setting";

export function UseWeightPort() {

  // set amplitude
  // const [amplitude, setAmplitude] = useState<number>();
  const {
    settings
  } = useScaleSetting();

  // isReady
  const [isReady, setIsReady] = useState<boolean>(false);

  // data for chart
  const maxWeightQueue = 20;
  const xData = Array.from({ length: maxWeightQueue }, (_, i) => `${i}`);
  const [yData, setYData] = useState<number[]>([]);
  const [yDataAmplitude, setYDataFake] = useState<number[]>([]);

  const addYData = (newItem: number) => {
    setYData((prevQueue) => {
      const updatedQueue = [...prevQueue, newItem];
      if (updatedQueue.length > maxWeightQueue) {
        updatedQueue.shift();
      }
      return updatedQueue;
    });
  };
  const addYDataFake = (newItem: number) => {
    setYDataFake((prevQueue) => {
      const updatedQueue = [...prevQueue, newItem];
      if (updatedQueue.length > maxWeightQueue) {
        updatedQueue.shift();
      }
      return updatedQueue;
    });
  };

  const [rawData, setRawData] = useState<string>('-1');

  const connectSerialPort = async () => {
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      enqueueSnackbar(`Đã kết nối cổng cân`, { variant: 'success' });

      setIsReady(true);
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setRawData('-1');
          setIsReady(false);
          break;
        }
        setRawData(value);
      }
      reader.releaseLock();
    } catch (error) {
      enqueueSnackbar(`Không kết nối được cổng cân`, { variant: 'warning' });
      console.error('Không kết nối được port', error);
      setRawData('-1');
      setIsReady(false);
    }
  }

  // data processing
  const [data, setData] = useState<number>(0);
  useEffect(() => {
    let dataAfter = -1;
    dataAfter = parseInt(rawData);
    if (Number.isNaN(dataAfter)) {
      dataAfter = -100;
    }

    // calc amplitude
    const amplitude = parseInt(settings.balanceValue.value as string);

    addYData(dataAfter);
    addYDataFake(dataAfter + amplitude);
    setData(dataAfter);

  },[rawData]);

  return {
    data,
    connectSerialPort,
    xData,
    yData,
    yDataAmplitude,
    isReady,
  }
}