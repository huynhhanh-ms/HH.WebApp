import Tesseract from 'tesseract.js';
import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import { Box, Card, Grid, Button, Typography } from '@mui/material';

import { FileApi } from 'src/services/api/file.api';

const ScaleCamera = forwardRef((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = React.useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null); // State để lưu URL của ảnh

  // Hàm khởi động camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // Hàm chụp ảnh từ video camera và gửi tới Tesseract
  const captureAndRunOCR = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas is not available.");
      return;
    }
    const context = canvas.getContext("2d");

    // Cài đặt kích thước của canvas để trùng với kích thước video
    if (!video) {
      console.error("Video is not available.");
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Vẽ frame hiện tại từ video lên canvas
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
      console.error("Failed to get 2D context.");
    }

    function convertToGrayscale(item) {
      const ctx = item.getContext('2d');
      const imageData = ctx.getImageData(0, 0, item.width, item.height);
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        // Tính giá trị đen trắng bằng cách lấy trung bình các kênh màu
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

        // Gán giá trị trung bình cho các kênh màu
        data[i] = avg;     // Đỏ
        data[i + 1] = avg; // Xanh lá
        data[i + 2] = avg; // Xanh dương
        // data[i + 3] là giá trị alpha (không thay đổi)
      }

      // Vẽ lại dữ liệu lên canvas
      ctx.putImageData(imageData, 0, 0);
    }

    function softBinarizeImage(item) {
      const ctx = item.getContext('2d');
      const imageData = ctx.getImageData(0, 0, item.width, item.height);
      const { data } = imageData;

      const threshold = 130; // Giảm ngưỡng để có ít pixel đen hơn
      const grayScaleFactor = 0.5; // Điều chỉnh độ xám cho pixel

      for (let i = 0; i < data.length; i += 4) {
        // Tính độ sáng của pixel
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

        // Nếu độ sáng nhỏ hơn ngưỡng, chuyển sang màu xám nhạt, nếu không thì màu trắng
        const binaryValue = avg < threshold ? avg * grayScaleFactor : 255;
        data[i] = binaryValue;     // Đỏ
        data[i + 1] = binaryValue; // Xanh lá
        data[i + 2] = binaryValue; // Xanh dương
        // data[i + 3] là kênh alpha (không thay đổi)
      }

      // Vẽ lại dữ liệu hình ảnh đã sửa đổi lên canvas
      ctx.putImageData(imageData, 0, 0);
    }

    function binarizeImage(item) {
      const ctx = item.getContext('2d');
      const imageData = ctx.getImageData(0, 0, item.width, item.height);
      const { data } = imageData;

      const threshold = 160; // You can adjust this threshold

      for (let i = 0; i < data.length; i += 4) {
        // Calculate the brightness of the pixel
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

        // Set pixel to black or white based on the threshold
        const binaryValue = avg < threshold ? 0 : 255;
        data[i] = binaryValue;     // Red
        data[i + 1] = binaryValue; // Green
        data[i + 2] = binaryValue; // Blue
        // data[i + 3] is the alpha channel (not modified)
      }

      // Put the modified image data back on the canvas
      ctx.putImageData(imageData, 0, 0);
    }

    // convertToGrayscale(canvas);
    // softBinarizeImage(canvas);


    // Lấy URL của ảnh từ canvas
    const url = canvas.toDataURL("image/png");
    setImageURL(url); // Lưu URL ảnh vào state để hiển thị



    // Biến canvas thành ảnh và gửi tới Tesseract
    canvas.toBlob(async (blob) => {
      if (blob) {
        setLoading(true);
        const worker = await Tesseract.createWorker('eng');
        await worker.setParameters({
          tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        });
        worker.recognize(blob)
          .then(({ data: { text } }) => {
            setOcrText(text);
            setLoading(false);
          })
          .catch((err) => {
            console.error("OCR failed:", err);
            setLoading(false);
          });
      } else {
        console.error("Failed to capture image from canvas.");
      }
    });
  };

  // Hàm chụp ảnh từ video camera
  const { mutateAsync: saveFile, data } = useMutation({
    mutationFn: FileApi.uploadFile,
    onError: (error) => {
      console.error('error khi lưu image: ', error);
    }
  });

  const captureImage = async (imageId): Promise<string | null> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas is not available.");
      return 'fail';
    }
    const context = canvas.getContext("2d");

    if (!video) {
      console.error("Video is not available.");
      return 'fail';
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;


    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `${imageId}.png`, { type: blob.type });
            const storagePath = `scale/${imageId}`;
            const imageUrl = await saveFile({ file, storagePath });
            // console.log('imageUrl: ', imageUrl);
            resolve(imageUrl);
          } else {
            resolve('fail');
          }
        });
      });
    } 
    return 'fail'; 
  };

  useImperativeHandle(ref, () => ({
    captureImage,
  }));

  useEffect(() => {
    const getCameraFeed = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (error) {
        console.error('Error accessing camera: ', error);
      }
    };

    if (isCameraActive) {
      getCameraFeed();
    }

    // Clean up function to stop the video stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        autoPlay
        playsInline
        sx={{
          width: '100%',
          height: '160px',
          border: '2px solid #272727',
          borderRadius: '10px',
        }}
      />
      <Grid container alignItems="stretch">
        <Grid item md={4}>
          <Button
            size='small'
            onClick={() => setIsCameraActive(!isCameraActive)}
            sx={{ marginTop: 1 }}
          >
            {isCameraActive ? 'Tắt' : 'Bật'}
          </Button>
        </Grid>
        <Grid item md={8}>
          <Card sx={{ marginTop: 1 }}>
            <Typography variant="body1" align="center">
              Camera cân xe
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* test ocr */}
      <div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {/* <Button onClick={captureAndRunOCR} disabled={loading}>
          {loading ? "Processing..." : "Capture & Recognize Text"}
        </Button>
        {imageURL && <img src={imageURL} alt="Captured" style={{ marginTop: "20px", width: "300px" }} />}
        <p><strong>OCR Result:</strong> {ocrText}</p> */}
      </div>
    </Box>

  );
});

export default ScaleCamera;
