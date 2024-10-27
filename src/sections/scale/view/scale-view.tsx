import type { Tank } from 'src/domains/dto/tank';
import type { GridColDef } from '@mui/x-data-grid';
import type { FuelImport } from 'src/domains/dto/fuel-import';
import type { GridApiCommunity } from '@mui/x-data-grid/internals';
import type { WeighingHistory } from 'src/domains/dto/weighing-history';

import { enqueueSnackbar } from 'notistack';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import { Grid, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DataGrid, useGridApiRef, useGridApiContext } from '@mui/x-data-grid';

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

import CameraFeed from '../camera-feed';
import TicketModal from '../ticket-modal';
import CustomDatePicker from '../custom-date-picker';



// ----------------------------------------------------------------------

export function ScaleView() {
  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();

  const [weightScale, setWeightScale] = useState<number>(-1);
  const [selectionTicket, setSelectionTicket] = useState<WeighingHistory | null>(null);

  const connectSerialPort = async () => {
    try {
      // Yêu cầu người dùng chọn thiết bị Serial Port
      const port = await (navigator as any).serial.requestPort();

      // Mở cổng serial với tốc độ baud (ví dụ: 9600, có thể thay đổi)
      await port.open({ baudRate: 9600 });

      // Tạo bộ đọc dữ liệu từ serial port
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      // setWeightScale(0);

      // eslint-disable-next-line no-constant-condition
      while (true) {

        // eslint-disable-next-line no-await-in-loop
        const { value, done } = await reader.read();
        if (done) {
          setWeightScale(-1);
          break;
        }
        console.log('Received data:', value);
        setWeightScale(parseInt(value));
      }

      // Đóng reader khi hoàn thành
      reader.releaseLock();
    } catch (error) {
      console.error('Error connecting to serial port:', error);
      setWeightScale(-1);
    }
  }


  // fake data
  useEffect(() => {
    // each time gen a random number
    // setTimeout(() => {
    //   setWeightScale(Math.floor(Math.random() * 100));
    // }, 4000);
    console.log("weightScale", weightScale);
  }, [weightScale]);

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
      icon: 'mdi:tanker-truck',
      func: () => {
        const selection = rows.find((row) => row.id === selectionTicket?.id);
        if (selection === undefined) {
          enqueueSnackbar('Chưa chọn dòng để cân', { variant: 'error' });
          return;
        }
        const updateSelection: WeighingHistory = {
          ...selection,
          totalWeight: weightScale,
          totalWeighingDate: new Date().toISOString(),
          goodsWeight: weightScale - (selection.vehicleWeight ?? 0),
          totalCost: (weightScale - (selection.vehicleWeight ?? 0)) * (selection.price ?? 0)
        };

        // update state
        console.log("selection change");
        setSelectionTicket(updateSelection);
        setRows(
          rows.map((row) =>
            row.id === selectionTicket?.id ?
              updateSelection : row
          )
        );
      },
      disabled: false,
    },
    {
      name: 'Cân Xác Xe',
      icon: 'bi:truck-flatbed',
      func: () => {

        const selection = rows.find((row) => row.id === selectionTicket?.id);
        if (selection === undefined) {
          enqueueSnackbar('Chưa chọn dòng để cân', { variant: 'error' });
          return;
        }
        const updateSelection: WeighingHistory = {
          ...selection,
          vehicleWeight: weightScale,
          vehicleWeighingDate: new Date().toISOString(),
          goodsWeight: (selection.totalWeight ?? 0) - weightScale,
          totalCost: ((selection.totalWeight ?? 0) - weightScale) * (selection.price ?? 0)
        };

        // update state
        console.log("selection change");
        setSelectionTicket(updateSelection);
        setRows(
          rows.map((row) =>
            row.id === selectionTicket?.id ?
              updateSelection : row
          )
        );
      },
      disabled: false,
    },
    {
      name: 'Phiếu cân',
      icon: 'fluent:document-print-20-regular',
      func: (value) => {
        if (selectionTicket === null) {
          enqueueSnackbar('Chưa chọn dòng để tạo phiếu cân', { variant: 'error' });
          return;
        }
        isOpenPrint(true);
      },
      disabled: false,
    },
    {
      name: 'Lịch sử',
      icon: 'material-symbols:history',
      func: (value) => {

      },
      disabled: false,
    },
    {
      name: 'Thêm mới',
      icon: 'solar:add-square-broken',
      func: () => {
        setRows([...rows,
        {
          id: rows.length + 1,
          customerName: '',
          licensePlate: '',
          totalWeight: 0,
          vehicleWeight: 0,
          goodsWeight: 0,
          // time: new Date(),
          totalWeighingDate: '',
          vehicleWeighingDate: '',
          note: '',
          address: '',
          goodsType: '',
          vehicleImages: ['hàng+Xe', 'Xác'],
        }]);
      },
    },
    {
      name: 'Lưu',
      icon: 'ic:round-save',
      func: () => {

      },
    }
  ]

  // print function
  const [openPrint, isOpenPrint] = useState(false);


  const handleProcessRowUpdate = (newRow: WeighingHistory, oldRow: WeighingHistory): WeighingHistory | Promise<WeighingHistory> => {
    const newGoodsWeight = (newRow.totalWeight ?? 0) - (newRow.vehicleWeight ?? 0);
    const updatedTotal = newGoodsWeight * (newRow.price ?? 0);

    setRows(
      rows.map((row) =>
        row.id === newRow.id ?
          { ...newRow, totalCost: updatedTotal } : row
      )
    );

    return { ...newRow, totalCost: updatedTotal };

  }

  return (
    <DashboardContent maxWidth={false}>
      <Grid container spacing={3}>
        <Grid item container spacing={3} xs={12} md={10}>
          {/* //*Weight Number in Left */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent >
                {weightScale !== -1 ?
                  <Typography variant="h1" align='right' sx={{ paddingLeft: '40px' }}>
                    {fNumber(weightScale)} Kg
                  </Typography>
                  :
                  <Button onClick={connectSerialPort} size='large'> 
                  <Typography variant="h1" align='right' sx={{ paddingLeft: '40px' }}>
                  Chọn Cân 
                  </Typography> </Button>
                }

              </CardContent>
            </Card>
          </Grid>
          {/* Button in Middle */}
          <Grid item xs={12} md={8} container alignContent="space-evenly" spacing={1}>
            {functions.map((item, index) => (
              <Grid key={index} item xs={3} md={3}>
                <Button startIcon={<Iconify icon={item.icon} />} size='large' variant='contained' disabled={item.disabled} fullWidth onClick={item.func}>{item.name}</Button>
              </Grid>
            ))}
          </Grid>

          {/* Button in Right */}
          <Grid item xs={12} md={6} container alignItems="end" spacing={1}>
            <Grid item>
              <CustomDatePicker title='Từ ngày' />
            </Grid>
            <Grid item>
              <CustomDatePicker title='Đến ngày' />
            </Grid>
            <Grid item>
              <div className='flex flex-col gap-2'>
                <Button size='small' variant='contained' > Đặt lại</Button>
                <Button size='small' variant='contained' > Tìm kiếm</Button>
              </div>
            </Grid>
          </Grid>

        </Grid>

        {/* //*Camera  */}
        <Grid item xs={2}>
          {/* <CameraFeed /> */}
          {/* <OCRComponent/> */}
        </Grid>
      </Grid>

      <Typography variant="h4" flexGrow={1} padding={2} >
        Trạm cân
      </Typography>

      <DataGrid rows={rows} columns={columns} sx={sxDataGrid}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        apiRef={apiRef}
        // pageSizeOptions={[5]}
        onRowSelectionModelChange={(selection) => {
          console.log("selection change");
          setSelectionTicket(rows[selection[0] as number - 1]);
        }}
        onRowCountChange={(newCount) => {
          apiRef.current?.setRowSelectionModel([rows.length]);
        }}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        disableMultipleRowSelection

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
    sortable: false,
  },

  {
    field: 'licensePlate',
    headerName: 'Biển số xe',
    width: 125,
    sortable: false,
    editable: true,
  },

  {
    field: 'totalWeight',
    headerName: 'Kl hàng + xe',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,

    editable: true,
    width: 100,
    type: 'number',
  },

  {
    field: 'vehicleWeight',
    headerName: 'Kl xe',
    editable: true,
    sortable: false,

    width: 100,
    type: 'number',
  },

  {
    field: 'goodsWeight',
    headerName: 'Kl hàng',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,

    width: 100,
    type: 'number',
  },
  {
    field: 'price',
    headerName: 'Đơn giá',
    sortable: false,
    editable: true,
    type: 'number',
  },
  {
    field: 'totalCost',
    headerName: 'Tổng tiền',
    sortable: false,
    type: 'number',
  },
  {
    field: 'time',
    headerName: 'Ngày cân',
    align: 'center',
    sortable: false,

    // width: 160,
    valueGetter: (value, row) => fDateTime((row as WeighingHistory).totalWeighingDate, formatStr.split.date),
  },
  {
    field: 'totalWeighingDate',
    headerName: 'Giờ XH',
    align: 'center',
    sortable: false,

    // width: 100,
    valueGetter: (value, row) => fDateTime((row as WeighingHistory).totalWeighingDate, formatStr.time),
  },
  {
    field: 'vehicleWeighingDate',
    headerName: 'Giờ xe',
    align: 'center',
    sortable: false,

    // width: 160,
    valueGetter: (value, row) => fDateTime((row as WeighingHistory).vehicleWeighingDate, formatStr.time),
  },
  {
    field: 'note',
    headerName: 'Ghi chú',
    sortable: false,

    width: 160,
    type: 'string',
    editable: true,
  },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    width: 100,
    editable: true,
    sortable: false,

  },
  {
    field: 'goodsType',
    headerName: 'Loại hàng',
    width: 110,
    editable: true,
    sortable: false,

  },
  {
    field: 'vehicleImages',
    headerName: 'hình ảnh',
    sortable: false,
    width: 160,
    type: 'string',

  },
];