import './print-style.css'

import type { WeighingHistory } from 'src/domains/dto/weighing-history';

import { Component } from "react";

import { Box, Divider, Typography, createTheme, ThemeProvider } from '@mui/material';

import { defaultNumber } from 'src/utils/global-util';
import { fNumber, fCurrency } from 'src/utils/format-number';
import { fDateTime, formatStr } from 'src/utils/format-time';

import { Logo } from 'src/components/logo';

interface Props {
  innerRef: React.RefObject<HTMLDivElement>;
  data: WeighingHistory
}


class Printable extends Component<Props> {
  render() {
    const { innerRef, data } = this.props;
    const contentLeft = [
      { title: 'Khách Hàng', value: data.customerName },
      { title: 'Trọng Lượng Xe + Hàng', value: `${data.totalWeight || 0}`, unit: 'kg' },
      { title: 'Trọng Lượng Xe', value: `${data.vehicleWeight || 0}`, unit: 'kg' },
      { divider: true },
      { title: 'Trọng Lượng Hàng', value: `${data.goodsWeight || 0}`, unit: 'kg' },
      // if data.impurityRatio > 0
      (defaultNumber(data.impurityRatio) > 0) ? { title: `${data.impurityRatio}% tạp`, value: `${data.impurityWeight || 0}`, unit: 'kg' } : {},
      (defaultNumber(data.impurityRatio) > 0) ? { divider: true } : {},
      (defaultNumber(data.impurityRatio) > 0) ? { title: 'Trọng Lượng Sạch', value: `${data.goodsWeightAfter || 0}`, unit: 'kg' } : {},
      { title: 'Giá', value: `${data.price || 0}`, unit: 'đ/kg' },
      { divider: true },
      { title: 'Thành tiền', value: `${data.totalCost || 0}`, unit: 'đ' },
    ];

    const contentRight = [
      { title: 'Số Phiếu', value: data.id },
      { title: 'Loại Hàng', value: data.goodsType || '' },
      // { title: 'Kho', value: data.storage || '' },
      { title: 'Biển Số Xe', value: data.licensePlate },
      // { title: 'Ngày Cân', value: fDateTime(data.totalWeighingDate || '', formatStr.split.date) },
      { title: 'Giờ Cân 1', value: fDateTime(data.totalWeighingDate || '') },
      { title: 'Giờ Cân 2', value: fDateTime(data.vehicleWeighingDate || '') },
      // { title: 'Nhập/Xuất', value: data.entryExit || '' },
      { title: 'Ghi Chú', value: data.note || '' },
      { image: false, list: data.vehicleImages || [] }
    ];

    const theme = createTheme({
      typography: {
        fontFamily: '"times", serif',
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <div ref={innerRef} style={{ padding: '20px', width: '100%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Content Wrapper */}
          <Box sx={{ padding: '0px', textAlign: 'center', flex: '1' }}>
            {/* <Box> */}
            {/* Header */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Logo isSingle={false} clickable={false} />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', flex: '1' }}>
                <Typography variant="body1" fontWeight="bold">
                  CÔNG TY TNHH TM DV HUYNH HẠNH
                </Typography>
                <Typography variant="body2">ĐC: 69 Thăng Quý - Vụ Bổn - Krông Pắk - Đắk Lắk</Typography>
                <Typography variant="body2">ĐT: 0903525647</Typography>
              </Box>
            </Box>

            {/* Title */}
            <Box sx={{ mt: 0, mb: 2 }}>
              <Typography variant="h5" fontWeight="bold">PHIẾU CÂN XE</Typography>
            </Box>

            {/* Content */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '60px' }}>
              {/* Left Content */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {contentLeft.map((item, index) => {
                  if (Object.keys(item).length === 0) {
                    return null;
                  }
                  if (item.divider) {
                    return (
                      <Divider key={index} />
                    )
                  }
                  return (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" paddingRight="50px">{item.title}:</Typography>
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" paddingRight={2}>{item.unit != null ? fNumber(item.value) : item.value}</Typography>
                        <Typography variant="body1" width={40} align='left'>{item.unit}</Typography>
                      </Box>
                    </Box>);
                }
                )}
              </Box>

              {/* Right Content */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {contentRight.map((item, index) => {
                  if (item.image) {
                    return (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {
                          item.list?.map((img, i) => (
                            <img key={i} src={img} alt="vehicle"
                              onError={(e: any) => {
                                // e.target.style.display = 'none';
                                e.target.src = '/assets/scale/placeholder.png';
                              }}
                              style={{ height: '80px', objectFit: 'contain' }} />
                          ))
                        }
                      </Box>
                    )
                  }
                  return (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" paddingRight="40px">{item.title}:</Typography>
                      <Typography variant="body1">{item.value}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 1, textAlign: 'right', paddingX: '80px' }}>
              <Typography variant="body2">Vụ Bổn, {new Date().toLocaleDateString('vi-VN')}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
              <Typography variant="body2">Khách Hàng</Typography>
              <Typography variant="body2" />
              <Typography variant="body2">Người Cân</Typography>
            </Box>

            {/* <Divider sx={{ mt: 4, mb: 2 }} /> */}
            {/* Adventise */}
            <Box sx={{ mt: 12 }}>
              <Typography variant="caption">
                Phầm mềm quản lý doanh nghiệp - Mạnh Hùng - KrongPac - Đắk Lắk - 0947.339.718
              </Typography>
            </Box>
          </Box>
        </div>
      </ThemeProvider>
    );
  }
}

export { Printable };