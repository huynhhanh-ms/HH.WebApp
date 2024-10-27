import './print-style.css'

import type { WeighingHistory } from 'src/domains/dto/weighing-history';

import { Component } from "react";

import { Box, Divider, Typography } from '@mui/material';

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
      { title: 'Số Phiếu', value: data.id },
      { title: 'Khách Hàng', value: data.customerName },
      { title: 'Trọng Lượng Xe Và Hàng', value: `${data.totalWeight || 0} Kg` },
      { title: 'Trọng Lượng Xe', value: `${data.vehicleWeight || 0} Kg` },
      { divider: true },
      { title: 'Trọng Lượng Hàng', value: `${data.goodsWeight || 0} Kg` },
      { title: 'Giá', value: `${data.price || 0}` },
      { divider: true },
      { title: 'Thành tiền', value: `${data.totalCost || 0}` },
    ];

    const contentRight = [
      { title: 'Loại Hàng', value: data.goodsType || '' },
      // { title: 'Kho', value: data.storage || '' },
      { title: 'Biển Số Xe', value: data.licensePlate },
      // { title: 'Ngày Cân', value: fDateTime(data.totalWeighingDate || '', formatStr.split.date) },
      { title: 'Giờ Cân 1', value: fDateTime(data.totalWeighingDate || '') },
      { title: 'Giờ Cân 2', value: fDateTime(data.vehicleWeighingDate || '') },
      // { title: 'Nhập/Xuất', value: data.entryExit || '' },
      { title: 'Ghi Chú', value: data.note || '' }
    ];

    return (
      <div ref={innerRef} style={{ padding: '20px', width: '100%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* Content Wrapper */}
        <Box sx={{ padding: '5px', textAlign: 'center', flex: '1' }}>
          {/* <Box> */}
          {/* Header */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Logo isSingle={false} clickable={false}/>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', flex: '1' }}>
              <Typography variant="h6" fontWeight="bold">
                CÔNG TY TNHH TM DV HUYNH HẠNH
              </Typography>
              <Typography variant="body2">ĐC: 69 Thăng Quý - Vụ Bổn - Krông Pắk - Đắk Lắk</Typography>
              <Typography variant="body2">ĐT: 0903525647</Typography>
            </Box>
          </Box>

          {/* Title */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">PHIẾU CÂN XE</Typography>
          </Box>

          {/* Content */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
            {/* Left Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {contentLeft.map((item, index) => {
                if (item.divider) {
                  return (
                    <Divider key={index} />
                  )
                }
                return (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" paddingRight="40px">{item.title}:</Typography>
                    <Typography variant="body1">{item.value}</Typography>
                  </Box>);
              }
              )}
            </Box>

            {/* Right Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {contentRight.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" paddingRight="40px">{item.title}:</Typography>
                  <Typography variant="body1">{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'right', paddingX: '80px' }}>
            <Typography variant="body2">Vụ Bổn, Ngày {new Date().toLocaleDateString('vi-VN')}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4 }}>
            <Typography variant="body2">Khách Hàng</Typography>
            <Typography variant="body2">NV Bảo Vệ</Typography>
            <Typography variant="body2">Người Cân</Typography>
          </Box>

          {/* <Divider sx={{ mt: 4, mb: 2 }} /> */}
          {/* Adventise */}
          <Box sx={{ mt: 16 }}>
            <Typography variant="caption">
              Phầm mềm quản lý doanh nghiệp - Mạnh Hùng - KrongPac - Đắk Lắk - 0947.339.718
            </Typography>
          </Box>
        </Box>
      </div>
    );
  }
}

export { Printable };