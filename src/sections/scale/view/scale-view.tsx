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
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Grid, Icon, Tooltip, CardContent } from '@mui/material';
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

import ScaleCamera from '../scale-camera';
import TicketModal from '../ticket-modal';
import CustomDatePicker from '../custom-date-picker';
import { ScaleSettingModal } from '../scale-setting-modal';



// ----------------------------------------------------------------------

export function ScaleView() {
  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();

  const [weightScale, setWeightScale] = useState<number>(-1);
  const [selectionTicket, setSelectionTicket] = useState<WeighingHistory | null>(null);


  const childRef = useRef<any>();
  const saveImageFromCamera = async (imageId) => {
    if (childRef.current) {
      const imageUrl = await childRef.current.captureImage(imageId);
      // console.log('image url', imageUrl);
      return imageUrl;
    }
    return null;
  };

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
        // console.log('Received data:', value);
        setWeightScale(parseInt(value));
      }
      // Đóng reader khi hoàn thành
      reader.releaseLock();
    } catch (error) {
      console.error('Error connecting to serial port:', error);
      setWeightScale(-1);
    }
  }

  const { data } = useQuery({
    queryKey: [ApiQueryKey.weighingHistory],
    queryFn: WeighingHistoryApi.gets,
  });
  const [rows, setRows] = useState<WeighingHistory[]>([]);

  // create record
  const { mutateAsync: createRecord } = useMutation({
    mutationFn: WeighingHistoryApi.create,
    mutationKey: [ApiQueryKey.weighingHistory],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.weighingHistory] });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar('tạo thất bại, vui lòng thử lại hoặc sử dụng phần mềm cân offline', { variant: 'error' });
    }
  });
  // update record
  const { mutateAsync: updateRecord } = useMutation({
    mutationFn: WeighingHistoryApi.update,
    mutationKey: [ApiQueryKey.weighingHistory],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.weighingHistory] });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar('cập nhật thất bại, vui lòng thử lại hoặc sử dụng phần mềm cân offline', { variant: 'error' });
    }
  });

  useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);

  const [openSetting, setOpenSetting] = useState(false);

  const [onLoadTotal, setOnLoadTotal] = useState(false);
  const [onLoadVehicle, setOnLoadVehicle] = useState(false);
  const [onLoadAdd, setOnLoadAdd] = useState(false);

  const functions = [
    {
      name: 'Cân Hàng + Xe',
      icon: 'mdi:tanker-truck',
      func: async () => {
        setOnLoadTotal(true);

        const selection = rows.find((row) => row.id === selectionTicket?.id);
        if (selection === undefined) {
          enqueueSnackbar('Chưa chọn dòng để cân', { variant: 'error' });
          return;
        }

        const updateSelection: WeighingHistory = {
          ...selection,
          totalWeight: weightScale,
          totalWeighingDate: new Date(),
          goodsWeight: weightScale - (selection.vehicleWeight ?? 0),
          totalCost: (weightScale - (selection.vehicleWeight ?? 0)) * (selection.price ?? 0),
        };

        // update state
        console.log("update api h+x");
        setSelectionTicket(updateSelection);

        await updateRecord(updateSelection);
        // offline
        // setRows(
        //   rows.map((row) =>
        //     row.id === selection.id ?
        //       updateSelection : row
        //   )
        // );

        setOnLoadTotal(false);

        // save image from camera
        saveImageFromCamera(`total${selection.id}`).then((imageUrl) => {
          const listImage = selection.vehicleImages ?? [];
          if ((selection?.vehicleImages?.length ?? 0) <= 0) {
            listImage.push(imageUrl);
          } else {
            listImage[0] = imageUrl;
          }

          // update image later
          const selectionWithImage: WeighingHistory = {
            id: updateSelection.id,
            vehicleImages: listImage,
          };
          setSelectionTicket({...updateSelection, vehicleImages: listImage});
          updateRecord(selectionWithImage);
        });
      },
      disabled: false,
      onLoad: onLoadTotal,
    },
    {
      name: 'Cân Xác Xe',
      icon: 'bi:truck-flatbed',
      func: async () => {

        setOnLoadVehicle(true);

        const selection = rows.find((row) => row.id === selectionTicket?.id);
        if (selection === undefined) {
          enqueueSnackbar('Chưa chọn dòng để cân', { variant: 'error' });
          return;
        }

        const updateSelection: WeighingHistory = {
          ...selection,
          vehicleWeight: weightScale,
          vehicleWeighingDate: new Date(),
          goodsWeight: (selection.totalWeight ?? 0) - weightScale,
          totalCost: ((selection.totalWeight ?? 0) - weightScale) * (selection.price ?? 0),
        };

        // update state
        console.log("update api x");
        setSelectionTicket(updateSelection);

        await updateRecord(updateSelection);
        // offline
        // setRows(
        //   rows.map((row) =>
        //     row.id === selection.id ?
        //       updateSelection : row
        //   )
        // );

        setOnLoadVehicle(false);

        // save image from camera
        saveImageFromCamera(`vehicle${selection.id}`).then((imageUrl) => {
          const listImage = selection.vehicleImages ?? [];
          if ((selection?.vehicleImages?.length ?? 0) <= 1) {
            if ((selection?.vehicleImages?.length ?? 0) <= 0) {
              listImage.push('not yet');
            }
            listImage.push(imageUrl);
          } else {
            listImage[1] = imageUrl;
          }

          // update image later
          const selectionWithImage: WeighingHistory = {
            id: updateSelection.id,
            vehicleImages: listImage,
          };
          setSelectionTicket({...updateSelection, vehicleImages: listImage});
          updateRecord(selectionWithImage);
        });

      },
      disabled: onLoadVehicle,
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
      disabled: selectionTicket === null,
    },
    {
      name: 'Lịch sử',
      icon: 'material-symbols:history',
      func: (value) => {

      },
      disabled: true,
    },
    {
      name: 'Thêm mới',
      icon: 'solar:add-square-broken',
      func: () => {
        const newRow = {
          id: rows.length + 1,
          customerName: '',
          licensePlate: '',
          totalWeight: 0,
          vehicleWeight: 0,
          goodsWeight: 0,
          note: '',
          address: '',
          goodsType: '',
          // vehicleImages: ['🖼️','🖼️'],
          vehicleImages: [],
        };

        // offline
        // setRows([...rows,
        //   newRow
        // ]);

        // create api
        console.log("create api");
        createRecord(newRow);
      },
    },
    // {
    //   name: 'Lưu',
    //   icon: 'ic:round-save',
    //   func: () => {

    //   },
    //   disabled: true,
    // },
    {
      name: 'Cài đặt',
      icon: 'lsicon:setting-outline',
      func: () => {
        setOpenSetting(true);
      },
      disabled: false,
    },

  ]

  // print function
  const [openPrint, isOpenPrint] = useState(false);


  const handleProcessRowUpdate = (newRow: WeighingHistory, oldRow: WeighingHistory): WeighingHistory | Promise<WeighingHistory> => {
    if (newRow?.totalWeight !== 0 && newRow?.vehicleWeight !== 0) {
      newRow.goodsWeight = (newRow.totalWeight ?? 0) - (newRow.vehicleWeight ?? 0);
      newRow.totalCost = newRow.goodsWeight * (newRow.price ?? 0);
    }
    else {
      newRow.goodsWeight = 0;
      newRow.totalCost = 0;
    }

    if (newRow.goodsWeight === 0) {
      newRow.goodsWeight = undefined;
    }
    if (newRow.totalCost === 0) {
      newRow.totalCost = undefined;
    }

    console.log('onProcessRowUpdate', newRow);

    updateRecord(newRow);
    // offline
    // setRows(
    //   rows.map((row) =>
    //     row.id === newRow.id ?
    //       newRow  : row
    //   )
    // );
    return newRow;
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
              <Grid key={index} item xs={6} md={4} lg={3}>
                <LoadingButton loading={item?.onLoad} color="inherit" startIcon={<Iconify icon={item.icon} />} size='large' variant='contained' disabled={item.disabled} fullWidth onClick={item.func}>{item.name}</LoadingButton>
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
          <ScaleCamera ref={childRef} />
          {/* <OCRComponent/> */}
        </Grid>
      </Grid>

      <Typography variant="h4"padding={1} >
        Trạm cân
      </Typography>

      <DataGrid rows={rows} columns={columns} sx={sxDataGrid}
        autoHeight
        slots={{
          noRowsOverlay: () => <Box display="flex" justifyContent="center" height="100%">
            <Typography variant="h6" color="textSecondary" align="center" textAlign="center" sx={{ mt: 2 }}>
              Không có dòng nào - Hãy thêm mới
            </Typography>
          </Box>,
        }}
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
          console.log("selection record change", selection);
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
      {openSetting && <ScaleSettingModal open={openSetting} onClose={() => setOpenSetting(false)} />}
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
    field: 'vehicleImages',
    headerName: 'Hình ảnh',
    sortable: false,
    // width: 160,
    type: 'string',
    renderCell: (params) => (
      <Tooltip
        enterDelay={500}
        enterTouchDelay={500}
        enterNextDelay={500}
        title={(
          <Box display="flex" flexDirection="row" alignItems="center">
            {params.value?.map((img, index) => (
              <Box
                key={index}
                component="img"
                alt={`Ảnh cân ${img}`}
                onError={(e: any) => {
                  e.target.style.display = 'none';
                }}
                src={img}
                sx={{ marginRight: '8px' }}
              />
            ))}
          </Box>
        )} >
        <Box>
          {params.value?.map((img, index) => (
            <Iconify key={index} icon="line-md:image-twotone" style={{ color: "#828282" }} />
          ))}
        </Box>
      </Tooltip >

    ),
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

];