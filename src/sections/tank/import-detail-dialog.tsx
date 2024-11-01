import type { FuelImport } from "src/domains/dto/fuel-import";

import { Table, Paper, Dialog, Button, TableRow, TableHead, TableCell, TableBody, Typography, DialogTitle, DialogActions, DialogContent, TableContainer } from "@mui/material";

import { fDateTime } from "src/utils/format-time";

interface Props {
  data?: FuelImport;
  open: boolean;
  onClose: () => void;
}

export function ImportDetailDialog({ data, open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Lô nhập #{data?.id} - {fDateTime(data?.importDate)}</DialogTitle>
      <DialogContent>


<Typography variant="h5">Thông tin lô nhập</Typography>
<Typography variant="body1">

        Ở đây ghi chi tiết về lô nhập nữa nha.... thêm kinh phí $$$<br/>

</Typography>

<br/>
        Đợt chốt sử dụng lô nhập

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Mã nhập xăng</TableCell>
                <TableCell>Mã phiên</TableCell>
                <TableCell>Thể tích sử dụng</TableCell>
                <TableCell>Doanh thu</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày cập nhật</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.fuelImportSessions?.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.id}</TableCell>
                  <TableCell>{session.fuelImportId}</TableCell>
                  <TableCell>{session.sessionId}</TableCell>
                  <TableCell>{session.volumeUsed}</TableCell>
                  <TableCell>{session.salePrice.toLocaleString("vi-VN")}</TableCell>
                  <TableCell>{new Date(session.createdAt).toLocaleString("vi-VN")}</TableCell>
                  <TableCell>{new Date(session.updatedAt).toLocaleString("vi-VN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}