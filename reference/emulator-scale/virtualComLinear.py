import argparse

import numpy as np
import serial, random, time

from smooth_random_wave import smooth_random_wave


# print(dir(serial))
def createPort(portName, baudRate):
    # Tạo cổng COM ảo
    ser = serial.Serial(
        port=portName,
        baudrate=9600,
        bytesize=serial.EIGHTBITS,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        xonxoff=False,
        rtscts=False,
        dsrdtr=False
    )
    return ser


# Tạo đối tượng parser
parser = argparse.ArgumentParser(description="Script để lấy cổng từ dòng lệnh")
# Thêm argument cho cổng
parser.add_argument("port", type=str, help="Số cổng để sử dụng")

# Phân tích các argument
args = parser.parse_args()

ser = createPort(args.port, 9600)

x = np.linspace(0, 10, 1000000)
y = smooth_random_wave(x, amplitude=2, frequency=1, noise_level=0.3, smoothness=100)

y_min = np.min(y)
y_max = np.max(y)
y_normalized = (y - y_min) / (y_max - y_min) * 5000

delay = 1
index = 0
step = 50


try:
    while True:
      try:
        # random_data = "+000001B"
        random_data = "+\x020000" + str(int(y_normalized[index])) + "000B"

        # Gửi dữ liệu qua cổng COM
        ser.write(random_data.encode())

        print(f"Sent: {random_data}")

        time.sleep(delay)
        index += step


      except serial.SerialException:
        print(f"COM port {ser.port} is not available.")
        break

except KeyboardInterrupt:
    pass

# Kiểm tra xem cổng đã mở chưa
if ser.is_open:
    print(f"COM port {ser.port} is open.")
else:
    print(f"Failed to open COM port {ser.port}.")

# # Đóng cổng COM khi không cần thiết
ser.close()