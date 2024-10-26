import type { Tank } from 'src/domains/dto/tank';
import type { GridColDef } from '@mui/x-data-grid';
import type { FuelImport } from 'src/domains/dto/fuel-import';
import type { WeighingHistory } from 'src/domains/dto/weighing-history';

import { enqueueSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import TableBody from '@mui/material/TableBody';
import { Grid, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fNumber } from 'src/utils/format-number';
import { fDateTime, formatStr } from 'src/utils/format-time';

import sxDataGrid from 'src/customs/sx-datagrid';
import { TankApi } from 'src/services/api/tank.api';
import { DashboardContent } from 'src/layouts/dashboard';
import { ApiQueryKey } from 'src/services/api-query-key';
import { FuelImportApi } from 'src/services/api/fuel-import.api';
import { WeighingHistoryApi } from 'src/services/api/weighing-history.api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { applyFilter, getComparator } from 'src/sections/tank/utils';

import TicketModal from '../ticket-modal';



// ----------------------------------------------------------------------

export function ScaleView() {
  const queryClient = useQueryClient();

  const [weightScale, setWeightScale] = useState<number>(0);
  const [selectionTicket, setSelectionTicket] = useState<WeighingHistory | null>(null);

  useEffect(() => {
    // each time gen a random number
    setTimeout(() => {
      setWeightScale(Math.floor(Math.random() * 100000));
    }, 1000);
  });

  const { data } = useQuery({
    queryKey: [ApiQueryKey.weighingHistory],
    queryFn: WeighingHistoryApi.gets,
  });

  const [rows, setRows] = useState<WeighingHistory[]>([]);

  useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);

  const functions = [
    {
      name: 'Cân Hàng + Xe',
      icon: 'mingcute:scale',
      weight: () => { console.log('123') },
      disabled: false,
    },
    {
      name: 'Cân Xác Xe',
      icon: 'mingcute:scale',
      weight: () => { console.log('123') },
      disabled: true,
    },
    {
      name: 'Phiếu cân',
      icon: 'mingcute:scale',
      func: (value) => {
        if (selectionTicket === null) {
          enqueueSnackbar('Chưa chọn dòng để tạo phiếu cân', { variant: 'error' });
          return;
        }
        isOpenPrint(true);
      },
      disabled: false,
    },

  ]

  // print function
  const [openPrint, isOpenPrint] = useState(false);


  return (
    <DashboardContent maxWidth='xl'>
      <Grid container spacing={3} mb={2}>
        {/* Weight Scale in Left */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent >
              <Typography variant="h2" align='right' sx={{ paddingLeft: '40px' }}>
                {fNumber(weightScale)} Kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Button in Right */}
        <Grid item xs={12} md={8} container alignContent="space-evenly" spacing={1}>
          {functions.map((item, index) => (
            <Grid key={index} item xs={3} md={3}>
              <Button size='large' variant='contained' disabled={item.disabled} fullWidth onClick={item.func}>{item.name}</Button>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Box display="flex" alignItems="center" mb={3}>
        <Typography variant="h4" flexGrow={1}>
          Trạm cân
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="ic:round-save" />}
        // onClick={() => setModalOpen(true)}
        >
          Lưu
        </Button>
      </Box>

      <DataGrid rows={rows} columns={columns} sx={sxDataGrid}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        // pageSizeOptions={[5]}

        // onCellClick={handleCellClick}

        onRowSelectionModelChange={(selection) => {
          setSelectionTicket(rows[(selection[0] as number) - 1]);
        }}
      // checkboxSelection
      // disableRowSelectionOnClick
      />

      {selectionTicket !== null && <TicketModal open={openPrint} onClose={() => isOpenPrint(false)} ticketData={selectionTicket} />}
    </DashboardContent>
  );
}

const columns: GridColDef<WeighingHistory>[] = [
  { field: 'id', headerName: 'ID', width: 30 },
  {
    field: 'customerName',
    headerName: 'Khách hàng',
    width: 160,
    editable: true,
  },

  {
    field: 'licensePlate',
    headerName: 'Biển số xe',
    width: 125,
    editable: true,
  },

  {
    field: 'totalWeight',
    headerName: 'Kl hàng + xe',
    description: 'This column has a value getter and is not sortable.',
    sortable: true,
    editable: true,
    width: 100,
    type: 'number',
  },

  {
    field: 'vehicleWeight',
    headerName: 'Kl xe',
    editable: true,
    sortable: true,
    width: 100,
    type: 'number',
  },

  {
    field: 'goodsWeight',
    headerName: 'Kl hàng',
    description: 'This column has a value getter and is not sortable.',
    sortable: true,
    width: 100,
    type: 'number',
    valueGetter: (value, row) => getGoodsWeight(row as WeighingHistory),
  },
  {
    field: 'time',
    headerName: 'Ngày cân',
    align: 'center',
    sortable: true,
    // width: 160,
    valueGetter: (value, row) => fDateTime((row as WeighingHistory).totalWeighingDate, formatStr.split.date),
  },
  {
    field: 'totalWeighingDate',
    headerName: 'Giờ XH',
    align: 'center',
    sortable: true,
    // width: 100,
    valueGetter: (value, row) => fDateTime((row as WeighingHistory).totalWeighingDate, formatStr.time),
  },
  {
    field: 'vehicleWeighingDate',
    headerName: 'Giờ xe',
    align: 'center',
    sortable: true,
    // width: 160,
    valueGetter: (value, row) => fDateTime((row as WeighingHistory).vehicleWeighingDate, formatStr.time),
  },
  {
    field: 'note',
    headerName: 'Ghi chú',
    sortable: true,
    width: 160,
    type: 'string',
  },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    width: 100,
    editable: true,
  },
  {
    field: 'goodsType',
    headerName: 'Loại hàng',
    width: 110,
    editable: true,
  },
  {
    field: 'vehicleImages',
    headerName: 'hình ảnh',
    sortable: true,
    width: 160,
    type: 'string',
  },
];

const getGoodsWeight = (row: WeighingHistory) => {
  if (!row) return '';
  if (row.totalWeight === undefined) return '';
  if (row.vehicleWeight === undefined) return '';
  if ((row.totalWeight || 0) - (row.vehicleWeight || 0) === 0) {
    return '';
  }
  return (row.totalWeight || 0) - (row.vehicleWeight || 0);
}
