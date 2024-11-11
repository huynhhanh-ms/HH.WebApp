import numpy as np
import matplotlib.pyplot as plt
import time
from scipy.interpolate import make_interp_spline


def smooth_random_wave(x, amplitude=0, frequency=1, noise_level=0.2, smoothness=50):
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
    # Tạo một số điểm ngẫu nhiên nhỏ để mô phỏng biên độ thay đổi mượt
    key_points = np.linspace(-1, max(x), num=int(len(x) / smoothness))
    random_amplitude = amplitude + np.random.uniform(-noise_level, noise_level, size=key_points.shape)
    random_frequency = frequency + np.random.uniform(-noise_level, noise_level, size=key_points.shape)

    # Nội suy spline để tạo các thay đổi mượt từ các điểm ngẫu nhiên
    amplitude_spline = make_interp_spline(key_points, random_amplitude)(x)
    frequency_spline = make_interp_spline(key_points, random_frequency)(x)

    # Tạo hàm sóng mượt ngẫu nhiên dựa trên sin(x)
    y = amplitude_spline * np.sin(frequency_spline * x)
    return y

