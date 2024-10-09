import type { Session } from "src/domains/dto/session";

import { Grid, Divider, CardHeader, Typography } from "@mui/material";

interface TotalCalcBoardProps {
  session?: Session;
}

export function TotalCalcBoard({ session }: TotalCalcBoardProps) {
  return (
    <>
      <CardHeader title="Tổng kết" />
      <Grid container spacing={2} height="23em" paddingTop={2}>

        <Grid item xs={12}>
          {/* <Grid item xs={5.5}> */}

          {/* chi phi phat sinh */}
          <div className='flex justify-between py-3 px-6'>
            <Typography variant="body1" fontStyle="italic">Chi phí phát sinh:</Typography>
            <Typography variant="body1">123</Typography>
          </div>

          {/* chi phi phat sinh */}
          <div className='flex justify-between py-3 px-6'>
            <Typography variant="body1" fontStyle="italic">Doanh thu</Typography>
            <Typography variant="body1">123</Typography>
          </div>

          <Divider orientation="horizontal" variant='middle' flexItem />
          <div className='flex justify-between py-3 px-6'>
            <Typography variant="body1" fontStyle="italic">Tổng tiền mặt</Typography>
            <Typography variant="body1">123</Typography>

          </div>

          <div className='flex justify-between py-3 px-6'>
            <Typography variant="body1" fontStyle="italic">Biên độ</Typography>
            <Typography variant="body1">Thiếu 123</Typography>

          </div>
        </Grid>

        {/* <Divider orientation="vertical" flexItem />
  <Grid item xs={5.5}>
    <Typography variant="body1">Kết thúc:</Typography>
    <Typography variant="h6" color="textSecondary">200</Typography>
  </Grid> */}
      </Grid>
    </>
  )
}