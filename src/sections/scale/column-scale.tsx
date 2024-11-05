import type { GridColDef } from "@mui/x-data-grid";
import type { WeighingHistory } from "src/domains/dto/weighing-history";

import { enqueueSnackbar } from "notistack";

import { Box, Tooltip } from "@mui/material";

import { fDateTime, formatStr } from "src/utils/format-time";

import { Iconify } from "src/components/iconify";


export type ScaleColumnField = keyof WeighingHistory;

export const editableColumns: GridColDef<WeighingHistory>[] = [
  // { field: 'id', headerName: 'ID', width: 30 },
  { field: 'serial', headerName: 'STT', width: 30 },
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
    preProcessEditCellProps: (params) => {
      const hasError = params.props.value < 0 || params.props.value > 1000000;
      if (hasError) {
        enqueueSnackbar('Trọng lượng nằm ngoài phạm vi [0, 1000000]', { variant: 'error' });
      }
      return { ...params.props, error: hasError };
    },
  },

  {
    field: 'vehicleWeight',
    headerName: 'Kl xe',
    editable: true,
    sortable: false,
    width: 100,
    type: 'number',
    preProcessEditCellProps: (params) => {
      const hasError = params.props.value < 0 || params.props.value > 1000000;
      if (hasError) {
        enqueueSnackbar('Trọng lượng nằm ngoài phạm vi [0, 1000000]', { variant: 'error' });
      }
      return { ...params.props, error: hasError };
    },
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
    width: 140,
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
          {params.value?.map((img, index) => {
            if (img === 'not yet' || img === '' || img === 'fail') {
              return null;
            }
            return (

              <Iconify key={index} icon="line-md:image-twotone" style={{ color: "#828282" }} />
            )
          })}
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

export const columns: GridColDef<WeighingHistory>[] = editableColumns.map((column) => {
  if (column.field === 'totalWeight' || column.field === 'vehicleWeight') {
    return ({
      ...column,
      editable: false,
    })
  }
  return column;
});

export const filterColumns: GridColDef<WeighingHistory>[] = editableColumns.map((column) => {
  if (column.field ==='serial') {
    return ({
      ...column,
      filterable: false,
      // valueGetter: (value, row) => (row as WeighingHistory).id,
    })
  }
  if (column.field === 'vehicleImages') {
    return ({
      ...column,
      editable: false,
    })
  }
  return ({
    ...column,
    editable: true,
  })
});