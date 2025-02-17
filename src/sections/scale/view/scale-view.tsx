import type { GridRowSelectionModel } from '@mui/x-data-grid';
import type { WeighingHistory } from 'src/domains/dto/weighing-history';

import { enqueueSnackbar } from 'notistack';
import { useRef, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { Grid, IconButton, CardActions, CardContent } from '@mui/material';

import { fNumber } from 'src/utils/format-number';
import { viVN } from 'src/utils/viVN-localize-data-grid';
import { setToEndOfDay, setToStartOfDay } from 'src/utils/global-util';

import sxDataGrid, { } from 'src/customs/sx-datagrid';
import { DashboardContent } from 'src/layouts/dashboard';
import { ApiQueryKey } from 'src/services/api-query-key';
import { useScaleSetting } from 'src/stores/use-scale-setting';
import { WeighingHistoryOffline } from 'src/services/api/offline/weighing-history.off';

import { Iconify } from 'src/components/iconify';

import TicketModal from '../ticket-modal';
import { CustomToolbar } from '../custom-toolbar';
import CustomDatePicker from '../custom-date-picker';
import { UseWeightPort } from '../hook/use-weight-port';
import { ScaleSettingModal } from '../scale-setting-modal';
import { columns, editableColumns } from '../column-scale';




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

  const { connectSerialPort, disconnectSerial, data: weightStreamData, xData, yData, yDataAmplitude, isReady } = UseWeightPort();

  // get data
  const { data } = useQuery({
    queryKey: [ApiQueryKey.weighingHistory, { startDate, endDate }],
    queryFn: () => WeighingHistoryOffline.gets({ startDate, endDate }),
  });
  const [rows, setRows] = useState<WeighingHistory[]>([]);

  useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);

  // create record
  const { mutateAsync: createRecord } = useMutation({
    mutationFn: WeighingHistoryOffline.create,
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
    mutationFn: (record: WeighingHistory) => WeighingHistoryOffline.update(record.id ?? 0, record),
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

  // const getItemFromId = (id: number): WeighingHistory | undefined => rows.find((item) => item.id === id)
  const getItemFromId = (id: number): WeighingHistory | undefined => apiRef.current.getRow(id) as WeighingHistory;

  const functions = [
    {
      //* Cân Hàng + Xe
      name: 'Cân Hàng + Xe',
      icon: 'mdi:tanker-truck',
      func: async () => {
        setOnLoadButton(true);

        const selection = getItemFromId(selectionTicket);
        if (selection === undefined) {
          enqueueSnackbar('Chưa chọn dòng để cân', { variant: 'error' }); setOnLoadButton(false); return;
        }
        if (validateWeight(weightStreamData) === false) {
          enqueueSnackbar('Số cân hiển thị không đúng, vui lòng thử lại', { variant: 'error' }); setOnLoadButton(false); return;
        }
        if ((selection?.totalWeight ?? 0) > 0 && settings.continueWeighing.value === false) {
          enqueueSnackbar('Đã cân rồi, không thể tiếp tục cân', { variant: 'error' }); setOnLoadButton(false); return;
        }

        const updateSelection: WeighingHistory = {
          ...selection,
          totalWeight: weightStreamData,
          totalWeighingDate: new Date(),
          vehicleImages: (settings.takeWeighingPhoto.value === true) ? selection.vehicleImages : updateImage({ url: 'not yet', type: 'total', list: selection.vehicleImages ?? [] }),
        };

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

        const selection = getItemFromId(selectionTicket);
        if (selection === undefined) {
          enqueueSnackbar('Chưa chọn dòng để cân', { variant: 'error' }); setOnLoadButton(false); return;
        }
        if (validateWeight(weightStreamData) === false) {
          enqueueSnackbar('Số cân hiển thị không đúng, vui lòng thử lại', { variant: 'error' }); setOnLoadButton(false); return;
        }
        if ((selection?.vehicleWeight ?? 0) > 0 && settings.continueWeighing.value === false) {
          enqueueSnackbar('Đã cân rồi, không thể tiếp tục cân', { variant: 'error' }); setOnLoadButton(false); return;
        }

        const updateSelection: WeighingHistory = {
          ...selection,
          vehicleWeight: weightStreamData,
          vehicleWeighingDate: new Date(),
          vehicleImages: (settings.takeWeighingPhoto.value === true) ? selection.vehicleImages : updateImage({ url: 'not yet', type: 'vehicle', list: selection.vehicleImages ?? [] }),
        };
        await updateRecord(updateSelection);
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
      disabled: selectionTicket < 0
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
        createRecord({});
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
      <div 
      style={{ height: 'calc(100vh - 375px)', width: '100%' }}
      >
        <DataGrid key={dataKey} rows={rows} columns={settings.manualEdit.value ? editableColumns : columns} sx={sxDataGrid}
          rowHeight={40}
          getRowId={(row) => row?.id ?? -1}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: () => <Box display="flex" justifyContent="center" height="100%">
              <Typography variant="h6" color="black" align="center" textAlign="center" sx={{ mt: 2 }}>
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
          onRowSelectionModelChange={(selection, selectionData) => {
            setSelectionTicket(selection[0] as number);
          }}
          onRowCountChange={(newCount) => {
            // move selected to last row
            if (newCount === 0) return;
            apiRef.current?.setRowSelectionModel([rows[newCount - 1].id as number]);
          }}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={(error) => console.error(error)}
          disableMultipleRowSelection
          ignoreDiacritics
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
        />
      </div>

      {/* //*Modal */}
      {selectionTicket >= 0 && <TicketModal open={openPrint} onClose={() => isOpenPrint(false)} ticketData={getItemFromId(selectionTicket) ?? {}} />}
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

