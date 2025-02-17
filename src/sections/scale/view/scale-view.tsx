import type { GridColDef } from '@mui/x-data-grid';
import type { WeighingHistory } from 'src/domains/dto/weighing-history';

import { enqueueSnackbar } from 'notistack';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DataGrid, GridToolbar, useGridApiRef, GridClearIcon, GridSearchIcon } from '@mui/x-data-grid';
import { Grid , Tooltip, debounce, TextField, IconButton, CardActions, CardContent, ThemeProvider, CardActionArea } from '@mui/material';

import { fNumber } from 'src/utils/format-number';
import { viVN } from 'src/utils/viVN-localize-data-grid';
import { fDateTime, formatStr } from 'src/utils/format-time';
import { setToEndOfDay, setToStartOfDay, removeVietnameseTones } from 'src/utils/global-util';

import { DashboardContent } from 'src/layouts/dashboard';
import { ApiQueryKey } from 'src/services/api-query-key';
import { useScaleSetting } from 'src/stores/use-scale-setting';
import { WeighingHistoryApi } from 'src/services/api/weighing-history.api';
import sxDataGrid, { filterColumnTheme, sxSelectorDataGrid } from 'src/customs/sx-datagrid';

import { Iconify } from 'src/components/iconify';

import ScaleCamera from '../scale-camera';
import TicketModal from '../ticket-modal';
import { CustomToolbar } from '../custom-toolbar';
import CustomDatePicker from '../custom-date-picker';
import { UseWeightPort } from '../hook/use-weight-port';
import { ScaleSettingModal } from '../scale-setting-modal';
import { columns, filterColumns, editableColumns } from '../column-scale';

import type { ScaleColumnField } from '../column-scale';



// ----------------------------------------------------------------------

export function ScaleView() {
  const queryClient = useQueryClient();
  const apiRef = useGridApiRef();

  const { settings } = useScaleSetting();
  const [selectionTicket, setSelectionTicket] = useState<number>(-1);

  const [dataKey, setDataKey] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date>(setToStartOfDay(new Date()));
  const [endDate, setEndDate] = useState<Date>(setToEndOfDay(new Date()));

  // take picture
  const childRef = useRef<any>();
  const saveImageFromCamera = async (imageId) => {
    if (childRef.current) {
      const imageUrl = await childRef.current.captureImage(imageId);
      return imageUrl;
    }
    return null;
  };

  const { connectSerialPort, disconnectSerial, data: weightStreamData, xData, yData, yDataAmplitude, isReady} = UseWeightPort();

  // get data
  const { data } = useQuery({
    queryKey: [ApiQueryKey.weighingHistory, { startDate, endDate }],
    queryFn: () => WeighingHistoryApi.gets({ startDate, endDate }),
  });
  const [rows, setRows] = useState<WeighingHistory[]>([]);

  useEffect(() => {
    if (data) {
      setRows(data.map((item, index) => ({ ...item, serial: index + 1 })));
    }
  }, [data]);

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


  const [openSetting, setOpenSetting] = useState(false);
  const [openPrint, isOpenPrint] = useState(false);

  const [onLoadButton, setOnLoadButton] = useState(false);

  // update list image
  interface UpdateProps {
    url: string;
    type: 'vehicle' | 'total';
    list: string[];
  };


  const updateImage = ({ url, type, list }: UpdateProps): string[] => {
    while (list.length < 2) {
      list.push('not yet');
    }

    if (type === 'vehicle') {
      list[1] = url;
    } else {
      list[0] = url;
    }
    return list;
  };

  const validateWeight = (weight: number): boolean => {
    if (weight < 0) {
      return false;
    }
    return true;
  }

  const functions = [
    {
      //* Cân Hàng + Xe
      name: 'Cân Hàng + Xe',
      icon: 'mdi:tanker-truck',
      func: async () => {
        setOnLoadButton(true);

        const selection = rows[selectionTicket];
        if (selection === undefined) {
          enqueueSnackbar('Chưa chọn dòng để cân', { variant: 'error' });
          setOnLoadButton(false)
          return;
        }
        if (validateWeight(weightStreamData) === false) {
          enqueueSnackbar('Số cân hiển thị không đúng, vui lòng thử lại', { variant: 'error' });
          setOnLoadButton(false);
          return;
        }
        if ((selection?.totalWeight ?? 0) > 0 && settings.continueWeighing.value === false) {
          enqueueSnackbar('Đã cân rồi, không thể tiếp tục cân', { variant: 'error' });
          setOnLoadButton(false);
          return;
        }

        const updateSelection: WeighingHistory = {
          ...selection,
          totalWeight: weightStreamData,
          totalWeighingDate: new Date(),
          goodsWeight: weightStreamData - (selection.vehicleWeight ?? 0),
          totalCost: (weightStreamData - (selection.vehicleWeight ?? 0)) * (selection.price ?? 0),
          vehicleImages: (settings.takeWeighingPhoto.value === true) ? selection.vehicleImages : updateImage({ url: 'not yet', type: 'total', list: selection.vehicleImages ?? [] }),
        };

        // update state
        console.log("update api h+x");
        // setSelectionTicket(updateSelection);

        await updateRecord(updateSelection);
        setOnLoadButton(false);

        // save image from camera
        if (settings.takeWeighingPhoto.value === true) {
          saveImageFromCamera(`total${selection.id}`).then((imageUrl) => {
            const listImage = updateImage({ url: imageUrl, type: 'total', list: selection.vehicleImages ?? [] });
            const selectionWithImage: WeighingHistory = {
              id: updateSelection.id,
              vehicleImages: listImage,
            };
            // setSelectionTicket({ ...updateSelection, vehicleImages: listImage });
            updateRecord(selectionWithImage);
          });
        }


      },
      disabled: false,
      onLoad: onLoadButton,
    },
    {
      //* Cân Xác xe
      name: 'Cân Xác Xe',
      icon: 'bi:truck-flatbed',
      func: async () => {
        setOnLoadButton(true);

        const selection = rows[selectionTicket];
        if (selection === undefined) {
          enqueueSnackbar('Chưa chọn dòng để cân', { variant: 'error' });
          setOnLoadButton(false);
          return;
        }
        if (validateWeight(weightStreamData) === false) {
          enqueueSnackbar('Số cân hiển thị không đúng, vui lòng thử lại', { variant: 'error' });
          setOnLoadButton(false);
          return;
        }
        if ((selection?.vehicleWeight ?? 0) > 0 && settings.continueWeighing.value === false) {
          enqueueSnackbar('Đã cân rồi, không thể tiếp tục cân', { variant: 'error' });
          setOnLoadButton(false);
          return;
        }

        const updateSelection: WeighingHistory = {
          ...selection,
          vehicleWeight: weightStreamData,
          vehicleWeighingDate: new Date(),
          goodsWeight: (selection.totalWeight ?? 0) - weightStreamData,
          totalCost: ((selection.totalWeight ?? 0) - weightStreamData) * (selection.price ?? 0),
          vehicleImages: (settings.takeWeighingPhoto.value === true) ? selection.vehicleImages : updateImage({ url: 'not yet', type: 'vehicle', list: selection.vehicleImages ?? [] }),
        };

        // update state
        console.log("update api x");
        // setSelectionTicket(updateSelection);

        await updateRecord(updateSelection);
        // offline
        // setRows(
        //   rows.map((row) =>
        //     row.id === selection.id ?
        //       updateSelection : row
        //   )
        // );

        setOnLoadButton(false);

        // save image from camera
        if (settings.takeWeighingPhoto.value === true) {
          saveImageFromCamera(`vehicle${selection.id}`).then((imageUrl) => {
            const listImage = updateImage({ url: imageUrl, type: 'vehicle', list: selection.vehicleImages ?? [] });
            // update image later
            const selectionWithImage: WeighingHistory = {
              id: updateSelection.id,
              vehicleImages: listImage,
            };
            // setSelectionTicket({ ...updateSelection, vehicleImages: listImage });
            updateRecord(selectionWithImage);
          });
        }
      },
      disabled: onLoadButton,
    },
    {
      name: 'Phiếu cân',
      icon: 'fluent:document-print-20-regular',
      func: (value) => {
        if (selectionTicket < 0) {
          enqueueSnackbar('Chưa chọn dòng để tạo phiếu cân', { variant: 'error' });
          return;
        }
        isOpenPrint(true);
      },
      disabled: selectionTicket < 0,
    },
    //* reset
    {
      name: 'Tải lại',
      icon: 'material-symbols:history',
      func: (value) => {
        // setFilterRow([initFilterRow]);
        setDataKey(dataKey + 1);

        setStartDate(setToStartOfDay(new Date()));
        setEndDate(setToEndOfDay(new Date()));
        // apiRef.current.stopHeaderFilterEditMode();
      },
      disabled: false,
    },
    {
      name: 'Thêm mới',
      icon: 'solar:add-square-broken',
      func: () => {
        const newRow = {
          id: 0, customerName: '', licensePlate: '', totalWeight: 0, vehicleWeight: 0, goodsWeight: 0, note: '', address: '', goodsType: '', vehicleImages: [],
        };

        // offline
        // setRows([...rows,
        //   newRow
        // ]);

        // create api
        console.log("create api");
        createRecord(newRow);
      },
      disabled: onLoadButton,
    },
    {
      name: 'Cài đặt',
      icon: 'lsicon:setting-outline',
      func: () => {
        setOpenSetting(true);
      },
      disabled: false,
    },

  ]

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
    return newRow;
  }

  return (
    <DashboardContent maxWidth={false}>
      <Grid container spacing={0}>
        <Grid item container spacing={1} xs={12} md={10}>
          {/* //*Weight Number in Left */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent >
                {isReady !== false ?
                  <Typography variant="h1" align='right' sx={{ paddingLeft: '40px' }}>
                    {fNumber(weightStreamData)}{''}
                  </Typography>
                  :
                  <Button onClick={connectSerialPort} size='large'>
                    <Typography variant="h1" align='right' sx={{ paddingLeft: '40px' }}>
                      Chọn Cân
                    </Typography> </Button>
                }

              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                {/* <IconButton size="small" onClick={() => setOpenSetting(true)}><Iconify icon="pepicons-print:list" /></IconButton> */}
                <IconButton size="small" onClick={() => disconnectSerial()}><Iconify icon="pepicons-pop:reload" /></IconButton>
              </CardActions>
            </Card>
          </Grid>
          {/* //*Button in Middle */}
          <Grid item xs={12} md={8} container alignContent="space-evenly" spacing={1}>
            {functions.map((item, index) => (
              <Grid key={index} item xs={6} md={6} lg={4}>
                <LoadingButton loading={item?.onLoad} color="inherit" startIcon={<Iconify icon={item.icon} />} size='large' variant='contained' disabled={item.disabled} fullWidth onClick={item.func}>{item.name}</LoadingButton>
              </Grid>
            ))}
          </Grid>

          {/* //*filter date */}
          <Grid item xs={12} container alignItems="start" spacing={1} justifyContent="start">
            <Grid item>
              <CustomDatePicker title='Từ ngày' date={startDate} setDate={setStartDate} />
            </Grid>
            <Grid item>
              <CustomDatePicker title='Đến ngày' date={endDate} setDate={setEndDate} />
            </Grid>
            {/* <Grid item alignSelf="center">
                <Button size='medium' variant='contained' > Tìm kiếm</Button>
            </Grid> */}
          </Grid>
        </Grid>

        {/* //*Camera  */}
        {/* <Grid item xs={2}>
          <ScaleCamera ref={childRef} />
          <OCRComponent/>
        </Grid> */}
      </Grid>

      <Typography variant="h4" padding={1} >
        {/* Trạm cân */}
      </Typography>

      {/* //*Filter */}
      {/* <ThemeProvider theme={filterColumnTheme}>
        <Box height={40}>
          <DataGrid rows={filterRow} columns={filterColumns} sx={sxSelectorDataGrid} hideFooter columnHeaderHeight={0} disableMultipleRowSelection onCellKeyDown={(params) => {
            console.log('key down');
            // apiRef.current.showFilterPanel();
            apiRef.current.setFilterModel({ items: [{ field: params.field, value: params.formattedValue, operator: 'contains' }] })
          }} onCellModesModelChange={(params) => { }} rowHeight={30} /></Box> </ThemeProvider> */}

      {/* //*Data table */}
      <DataGrid key={dataKey} rows={rows} columns={settings.manualEdit.value ? editableColumns : columns} sx={sxDataGrid}
        getRowId={(row) => row?.serial ?? -1}
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: () => <Box display="flex" justifyContent="center" height="100%">
            <Typography variant="h6" color="textSecondary" align="center" textAlign="center" sx={{ mt: 2 }}>
              Không có dòng nào
            </Typography>
          </Box>,
        }}
        initialState={{
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: [],
            },
          },
          density: 'compact',
        }}

        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        apiRef={apiRef}
        // pageSizeOptions={[5]}
        onRowSelectionModelChange={(selection) => {
          console.log("selection record change", selection);
          setSelectionTicket(selection[0] as number - 1);
        }}
        onRowCountChange={(newCount) => {
          apiRef.current?.setRowSelectionModel([rows.length]);
        }}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
        disableMultipleRowSelection
        ignoreDiacritics
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
      />

      {/* //*Modal */}
      {selectionTicket >= 0 && <TicketModal open={openPrint} onClose={() => isOpenPrint(false)} ticketData={rows[selectionTicket]} />}
      {openSetting && <ScaleSettingModal open={openSetting} onClose={() => setOpenSetting(false)}
        chartData={
          {
            xTitle: xData,
            yData: [
              yData,
              yDataAmplitude
            ]
          }
        } />}
    </DashboardContent>
  );
}

