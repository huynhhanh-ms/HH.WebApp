import React, { useEffect } from 'react';

import { Button } from '@mui/material';

const SerialComponent = () => {
  useEffect(() => {
    const connectSerial = async () => {
      try {
        if ("serial" in navigator) {
          console.log("The Web Serial API is supported.");
        }

        const port = await (navigator as any).serial.requestPort();

        // Mở cổng serial với tốc độ baud (ở đây là 9600, bạn có thể thay đổi theo yêu cầu)
        await port.open({ baudRate: 9600 });

        // Đọc dữ liệu từ serial port
        const reader = port.readable.getReader();

        while (true) {
          const { value, done } = reader.read();
          if (done) {
            console.log('Serial port closed');
            reader.releaseLock();
            break;
          }
          // In dữ liệu nhận được từ serial port ra console
          const textDecoder = new TextDecoder();
          console.log('Received data:', textDecoder.decode(value));
        }
      } catch (error) {
        console.error('Error connecting to serial port:', error);
      }
    };

    // connectSerial();
    console.log('SerialComponent mounted');
  }, []);


  const handleSelectPort = async (event: any) =>  {
  if ("serial" in navigator) {
    console.log("The Web Serial API is supported.");
  }
  else {
    console.log("The Web Serial API is not supported.");
  }
    // const port = await navigator.serial.requestPort();
    // const ports = await navigator.serial.getPorts();
  }

  useEffect(() => {
    fetch('/test.html')  // Đường dẫn tương đối tới file trong thư mục 'public'
      .then((response) => response.text())
      .then((text) => {
        console.log('Data from text file:', text);
      })
      .catch((error) => {
        console.error('Error fetching the file:', error);
      });
  }, []);


  return (
    <>

      <div>
        <h1>Serial Port Reader</h1>
        <p>Check the console for data from COM3.</p>
      </div>
      <Button variant="contained" color="primary"
        onClick={handleSelectPort}
      >Click me</Button>
    </>
  );
};

export default SerialComponent;
