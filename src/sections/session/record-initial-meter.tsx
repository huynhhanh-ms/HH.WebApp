import type { CardProps } from '@mui/material/Card';
import type { GridColDef, GridRowsProp } from '@mui/x-data-grid';

import * as React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

import sxDataGrid from 'src/customs/sx-datagrid';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: any[];
};

export function RecordInitialMeter({ title, subheader, list, ...other }: Props) {

  return (
    <Card {...other}>
      {/* <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} /> */}
      <DataGrid rows={rows} columns={columns} sx={sxDataGrid}
        isCellEditable={(params) => parseInt(params.id.toString(), 10) < 3}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage >= 2 ? 'Mui-selected' : ''
        }
        autoHeight
        hideFooter
      />
      <Box sx={{ p: 2, textAlign: 'right', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          size="small"
          color="inherit"
          variant='contained'
        >
          Lưu
        </Button>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="mingcute:down-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          Chi tiết hơn
        </Button>
      </Box>
    </Card>
  );
}

const columns: GridColDef[] = [
  { field: 'meter', minWidth: 120, headerName: 'Công tơ (Lít)', sortable: false, disableColumnMenu: true },
  {
    field: 'gasoline',
    headerName: 'Xăng',
    type: 'number',
    editable: true,
    align: 'left',
    headerAlign: 'left',
    sortable: false,
  },
  {
    field: 'oil',
    headerName: 'Dầu',
    type: 'number',
    editable: true,
    align: 'left',
    headerAlign: 'left',
    sortable: false,
  },

];

const rows: GridRowsProp = [
  {
    id: 1,
    meter: 'Bắt đầu',
    gasoline: 1000,
    oil: 100,
  },
  {
    id: 2,
    meter: 'kết thúc',
    gasoline: 2000,
    oil: 200,
  },
  {
    id: 3,
    meter: 'Hiệu',
    gasoline: 3000,
    oil: 300,
  },
  {
    id: 4,
    meter: 'Giá bán',
    gasoline: 3200,
    oil: 300,
  },
  {
    id: 5,
    meter: 'Tổng tiền',
    gasoline: 3200,
    oil: 300,
  }
];
