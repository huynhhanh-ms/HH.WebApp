/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
import { randomInt } from "crypto";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";

import { useScaleSetting } from "src/stores/use-scale-setting";

export function UseWeightPort() {

  const {
    settings
  } = useScaleSetting();

  const [isReady, setIsReady] = useState<boolean>(false);

  // data for chart
  const maxWeightQueue = 40;
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
      const ports = await (navigator as any).serial.getPorts();
      let port;
      if (ports.length > 0) {
        port = ports[0];
      }
      else {
        port = await (navigator as any).serial.requestPort();
      }

      await port.open({ baudRate: 9600 });
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      enqueueSnackbar(`Đã kết nối cổng cân`, { variant: 'success' });

      let buffer = '';

      setIsReady(true);
      while (true) {
        const { value, done } = await reader.read();

        // const min = 1;
        // const max = 100;
        // const rand = min + Math.random() * (max - min);
        // const value = `${rand.toString()}B\x03\x02`;
        // await new Promise((resolve) => setTimeout(resolve, 2000)); // Giả lập độ trễ của reader.read()

        if (done) {
          setRawData('-1');
          setIsReady(false);
          break;
        }
        console.log('value: ', value);

        buffer += value;
        let startIdx; let endIdx;
        // eslint-disable-next-line no-cond-assign
        while ((startIdx = buffer.indexOf('\x02')) !== -1 && (endIdx = buffer.indexOf('\x03', startIdx)) !== -1) {
          const frame = buffer.substring(startIdx + 1, endIdx); // Lấy dữ liệu giữa STX và ETX

          const weight = parseInt(frame);
          if (Number.isNaN(weight)) {
            console.log('weight is NaN');
          }
          else {
            setRawData(weight.toString());
          }

          buffer = buffer.slice(endIdx + 1);
        }
      }
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

  }, [rawData]);

  return {
    data,
    connectSerialPort,
    xData,
    yData,
    yDataAmplitude,
    isReady,
  }
}