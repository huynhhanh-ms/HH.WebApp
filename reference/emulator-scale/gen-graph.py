import numpy as np
import matplotlib.pyplot as plt
import time


def smooth_random_wave(x, amplitude=1, frequency=1, noise_level=0.2, smoothness=50):
    """
    Tạo một hàm dạng sóng ngẫu nhiên trơn tru và mượt mà dựa trên hàm sin(x).

    Parameters:
        x (ndarray): Giá trị x trên trục ngang.
        amplitude (float): Biên độ cơ bản của sóng.
        frequency (float): Tần số cơ bản của sóng.
        noise_level (float): Mức độ nhiễu ngẫu nhiên.
        smoothness (int): Độ mượt của sóng, càng cao thì sóng càng mượt.

    Returns:
        ndarray: Giá trị y mượt ngẫu nhiên.
    """
    # Tạo sóng cơ bản dựa trên hàm sin(x)
    wave = amplitude * np.sin(2 * np.pi * frequency * x)

    # Thêm nhiễu ngẫu nhiên
    noise = np.random.normal(0, noise_level, len(x))

    # Kết hợp sóng và nhiễu
    noisy_wave = wave + noise

    # Làm mượt sóng bằng cách sử dụng hàm lọc
    smoothed_wave = np.convolve(noisy_wave, np.ones(smoothness) / smoothness, mode='same')

    return smoothed_wave


# Tạo dữ liệu x (trục ngang)
x = np.linspace(0, 10, 1000000)

# Tạo sóng ngẫu nhiên mượt mà
y = smooth_random_wave(x, amplitude=2, frequency=1, noise_level=0.3, smoothness=100)

# Chuẩn hóa y về khoảng [0, 1000000]
y_min = np.min(y)
y_max = np.max(y)
y_normalized = (y - y_min) / (y_max - y_min) * 1000000

# Kiểm tra miền giá trị của y sau khi chuẩn hóa
print("Giá trị nhỏ nhất của y chuẩn hóa:", np.min(y_normalized))
print("Giá trị lớn nhất của y chuẩn hóa:", np.max(y_normalized))

# Vẽ đồ thị ban đầu
plt.figure(figsize=(10, 6))
line, = plt.plot([], [], label='Smooth Random Wave')
plt.title('Smooth Random Wave Graph')
plt.xlabel('X')
plt.ylabel('Amplitude')
plt.grid(True)
plt.legend()


# Hàm vẽ và in tọa độ theo thời gian thực trên biểu đồ
def plot_coordinates_real_time(x, y_normalized, delay=0.5):
    """
    Vẽ đồ thị và in tọa độ theo thời gian thực trên biểu đồ mỗi delay giây.

    Parameters:
        x (ndarray): Giá trị x trên trục ngang.
        y_normalized (ndarray): Giá trị y đã chuẩn hóa.
        delay (float): Thời gian delay giữa các lần vẽ (s).
    """
    for i in range(len(x)):
        # Cập nhật dữ liệu đồ thị
        line.set_xdata(x[:i + 1])
        line.set_ydata(y_normalized[:i + 1])

        # In tọa độ trên đồ thị
        plt.text(x[i], y_normalized[i], f'({x[i]:.2f}, {y_normalized[i]:.2f})', color='red', fontsize=8)

        # Cập nhật lại đồ thị
        plt.draw()

        # Chờ một khoảng thời gian trước khi tiếp tục
        time.sleep(delay)


# Bật chế độ tương tác
plt.ion()
plt.show()

# Vẽ đồ thị và in tọa độ theo thời gian thực
plot_coordinates_real_time(x, y_normalized, delay=0.5)

# Tắt chế độ tương tác sau khi vẽ xong
plt.ioff()
plt.show()
