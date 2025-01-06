import type { FuelImport } from "src/domains/dto/fuel-import";

import { useQuery } from "@tanstack/react-query";

import { Grid, Table, Paper, Dialog, Button, Divider, TableRow, TableHead, TableCell, TableBody, Typography, DialogTitle, DialogActions, DialogContent, TableContainer } from "@mui/material";

import { fDateTime } from "src/utils/format-time";
import { fNumber, fCurrency } from "src/utils/format-number";

import { TankApi } from "src/services/api/tank.api";
import { ApiQueryKey } from "src/services/api-query-key";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TankHistoryDialog({ open, onClose }: Props) {
  const { data } = useQuery({
    queryKey: [ApiQueryKey.tank_history],
    queryFn: TankApi.getHistories,
  });

  return (
    <Dialog open={open} onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      {/* <DialogTitle>Lô nhập #{data?.id} - {fDateTime(data?.importDate)}</DialogTitle> */}
      <DialogContent>


        <Typography variant="h5">Lịch sử cân bằng bồn</Typography>
       
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã</TableCell>
                <TableCell>Tên bồn</TableCell>
                <TableCell>Thể tích</TableCell>
                <TableCell>Ngày lưu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item, index) => (
                <TableRow key={item.id} sx={{
                  backgroundColor: index % 2 === 0 ? "#f0f8ff" : "#ffffff",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{fNumber(item.currentVolume)}</TableCell>
                  <TableCell>{fDateTime(item.createdAt)}</TableCell>
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