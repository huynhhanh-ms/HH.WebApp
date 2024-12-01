import type { FuelImport } from "src/domains/dto/fuel-import";

import { Grid, Table, Paper, Dialog, Button, Divider, TableRow, TableHead, TableCell, TableBody, Typography, DialogTitle, DialogActions, DialogContent, TableContainer } from "@mui/material";

import { fDateTime } from "src/utils/format-time";
import { fNumber, fCurrency } from "src/utils/format-number";

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
        <Grid container spacing={2} paddingTop={2}>

          <Grid item xs={12}>
            {/* <Grid item xs={5.5}> */}

            {/* chi phi phat sinh */}
            <div className='flex justify-between py-3 px-6'>
              <Typography variant="body1">Ghi chú</Typography>
              <Typography variant="body1">{data?.note}</Typography>
            </div>

            <div className='flex justify-between py-3 px-6'>
              <Typography variant="body1">Thể tích</Typography>
              <Typography variant="body1">{[fNumber(data?.volumeUsed), fNumber(data?.importVolume)].join('/')}</Typography>
            </div>

            <div className='flex justify-between py-3 px-6'>
              <Typography variant="body1">Giá nhập</Typography>
              <Typography variant="body1">{fCurrency(data?.importPrice)}</Typography>
            </div>

            {/* chi phi phat sinh */}
            <div className='flex justify-between py-3 px-6'>
              <Typography variant="body1">Đơn giá: </Typography>
              <Typography variant="body1">{fCurrency(data?.totalCost)}</Typography>
            </div>

            <div className='flex justify-between py-3 px-6'>
              <Typography variant="body1">Tổng Bán</Typography>
              <Typography variant="body1">{fCurrency(data?.totalSalePrice)}</Typography>
            </div>
            <Divider orientation="horizontal" variant='middle' flexItem />
            <div className='flex justify-between py-3 px-6'>
              <Typography variant="body1">Lợi nhuận</Typography>
              <Typography variant="body1">{fCurrency((data?.totalSalePrice ?? 0) - (data?.totalCost ?? 0))}</Typography>
            </div>

          </Grid>
        </Grid>


        <br />
        Đợt chốt sử dụng lô nhập

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>ID</TableCell> */}
                {/* <TableCell>Mã nhập xăng</TableCell> */}
                <TableCell>Mã phiên</TableCell>
                {/* <TableCell>Giá bán đợt chốt</TableCell> */}
                <TableCell>Thể tích sử dụng</TableCell>
                <TableCell>Doanh thu</TableCell>
                <TableCell>Ngày tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.fuelImportSessions?.map((session) => (
                <TableRow key={session.id}>
                  {/* <TableCell>{session.id}</TableCell> */}
                  {/* <TableCell>{session.fuelImportId}</TableCell> */}
                  <TableCell>{session.sessionId}</TableCell>
                  <TableCell>{session.volumeUsed}</TableCell>
                  <TableCell>{fCurrency(session.salePrice)}</TableCell>
                  <TableCell>{fDateTime(session.createdAt)}</TableCell>
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