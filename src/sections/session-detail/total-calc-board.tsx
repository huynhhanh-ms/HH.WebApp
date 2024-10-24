import type { Session } from "src/domains/dto/session";

import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Box, Grid, Button, Divider, CardHeader, Typography } from "@mui/material";

import { fNumber } from "src/utils/format-number";

import { ApiQueryKey } from "src/services/api-query-key";
import { SessionApi } from "src/services/api/session.api";

import ChickiesDialog from "../tank/chickies-dialog";


interface TotalCalcBoardProps {
  session?: Session;
}

export function TotalCalcBoard({ session }: TotalCalcBoardProps) {

  const [openDialog, setOpenDialog] = useState(false);
  const handleSubmit = (event: any): void => {
    setOpenDialog(true);
  }

  const queryClient = useQueryClient(); 
  const { mutateAsync: closeSession } = useMutation({
    mutationFn: SessionApi.close,
    onSuccess: () => {
      enqueueSnackbar('Khóa sổ thành công', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.session] });
    },
    onError: () => {
      enqueueSnackbar('Khóa sổ thất bại', { variant: 'error' });
    }
  });
  const handleConfirmSubmit = (): void => {
    if (session) {
      closeSession(session.id);
    } 
  }

  return (
    <>
      <CardHeader title="Tổng kết" />
      <Grid container spacing={2} paddingTop={2}>

        <Grid item xs={12}>
          {/* <Grid item xs={5.5}> */}

          {/* chi phi phat sinh */}
          <div className='flex justify-between py-3 px-6'>
            <Typography variant="body1" fontStyle="italic">Chi phí phát sinh:</Typography>
            <Typography variant="body1">{session?.totalExpense}</Typography>
          </div>

          {/* chi phi phat sinh */}
          <div className='flex justify-between py-3 px-6'>
            <Typography variant="body1" fontStyle="italic">Doanh số (Tổng): </Typography>
            <Typography variant="body1">{fNumber(session?.petrolPumps?.reduce((acc, pump) => acc + pump.revenue, 0))}</Typography>
          </div>

          <Divider orientation="horizontal" variant='middle' flexItem />
          {/* <div className='flex justify-between py-3 px-6'>
            <Typography variant="body1" fontStyle="italic">Tổng tiền mặt</Typography>
            <Typography variant="body1">123</Typography>

          </div> */}

          <div className='flex justify-between py-3 px-6'>
            <Typography variant="body1" fontStyle="italic">Biên độ</Typography>
            <Typography variant="body1">{fNumber((session?.totalExpense ?? 0) - (session?.petrolPumps?.reduce((acc, pump) => acc + pump.revenue, 0) ?? 0))}</Typography>

          </div>
        </Grid>

        {/* <Divider orientation="vertical" flexItem />
  <Grid item xs={5.5}>
    <Typography variant="body1">Kết thúc:</Typography>
    <Typography variant="h6" color="textSecondary">200</Typography>
  </Grid> */}
      </Grid>
      <Box sx={{ p: 2, textAlign: 'right', display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="inherit" size="small" className="m-10" onClick={handleSubmit}>
          Khóa sổ
        </Button>
      </Box>
      <ChickiesDialog open={openDialog} onClose={() => setOpenDialog(false)} title="Xác nhận khóa sổ" description="Bạn chắc chắn muốn khóa sổ này không?" closeText="Hủy" confirmText="Khóa sổ" onConfirm={handleConfirmSubmit} />
    </>
  )
}