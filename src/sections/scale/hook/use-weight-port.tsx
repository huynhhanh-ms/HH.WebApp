/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
import { randomInt } from "crypto";
import { SerialPort } from "serialport";
import { enqueueSnackbar } from "notistack";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState, useEffect } from "react";

import { defaultNumber } from "src/utils/global-util";

import { useScaleSetting } from "src/stores/use-scale-setting";

export function UseWeightPort() {

  const {
    settings
  } = useScaleSetting();

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

  const [rawData, setRawData] = useState<number>(-1);
  const reader = useRef<ReadableStreamDefaultReader<string> | null>(null);
  const port = useRef<any>(null);
  const isReady = useRef<boolean>(false);

  const connectSerialPort = async () => {
    try {
      const ports = await (navigator as any).serial.getPorts();
      if (ports.length > 0) {
        port.current = ports[0];
      }
      else {
        port.current = await (navigator as any).serial.requestPort();
      }

      await port.current.open({ baudRate: 9600 });
      const textDecoder = new TextDecoderStream();
      reader.current = textDecoder.readable.getReader();
      const readableStreamClosed = port.current.readable.pipeTo(textDecoder.writable);
      enqueueSnackbar(`Đã kết nối cổng cân`, { variant: 'success' });

      let buffer = '';

      isReady.current = true;
      setRawData(0);
      while (isReady) {
        const { value, done } = await reader.current.read();

        if (done) {
          setRawData(-1);
          isReady.current = false;
          break;
        }
        // console.log('value: ', value);

        buffer += value;
        let startIdx; let endIdx;
        // eslint-disable-next-line no-cond-assign
        while ((startIdx = buffer.indexOf('\x02')) !== -1 && (endIdx = buffer.indexOf('\x03', startIdx)) !== -1) {
          const frame = buffer.substring(startIdx + 1, endIdx); // Lấy dữ liệu giữa STX và ETX

          const weight = parseInt(frame.slice(0, -3));
          if (Number.isNaN(weight)) {
            console.log('weight is NaN');
          }
          else {
            setRawData(weight);
          }

          buffer = buffer.slice(endIdx + 1);
        }
      }
    } catch (error) {
      enqueueSnackbar(`Không kết nối được cổng cân`, { variant: 'warning' });
      console.error('Không kết nối được port', error);
      setRawData(-1);
      isReady.current = false;
    }
  }

  const disconnectSerial = async () => {
    isReady.current = false;

    try {

      const textEncoder = new TextEncoderStream();
      const writer = textEncoder.writable.getWriter();
      const writableStreamClosed = textEncoder.readable.pipeTo(port.current.writable);

      if (reader.current) {
        reader.current.cancel();
      }
      // await readableStreamClosed.catch(() => { /* Ignore the error */ });

      writer.close();
      await writableStreamClosed;

      if (port.current) {
        await port.current.close();
      }
      enqueueSnackbar(`Đã ngắt kết nối`, { variant: "info" });
    } catch (error) {
      console.error("Lỗi ngắt kết nối:", error);
    }
  };

  // data processing
  const [data, setData] = useState<number>(0);
  useEffect(() => {
    // calc amplitude
    const amplitude = defaultNumber(parseInt(settings.balanceValue.value as string));

    addYData(rawData);
    addYDataFake(rawData + amplitude);

    setData(rawData + amplitude);

  }, [rawData, settings.balanceValue.value]);

  return {
    data,
    connectSerialPort,
    disconnectSerial,
    xData,
    yData,
    yDataAmplitude,
    isReady : isReady.current,
  }
}