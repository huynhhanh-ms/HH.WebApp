import type { Tank } from 'src/domains/dto/tank';
import type { GridColDef } from '@mui/x-data-grid';
import type { FuelImport } from 'src/domains/dto/fuel-import';

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

import sxDataGrid from 'src/customs/sx-datagrid';
import { TankApi } from 'src/services/api/tank.api';
import { DashboardContent } from 'src/layouts/dashboard';
import { ApiQueryKey } from 'src/services/api-query-key';
import { FuelImportApi } from 'src/services/api/fuel-import.api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { applyFilter, getComparator } from 'src/sections/tank/utils';

import TicketModal from '../ticket-modal';



// ----------------------------------------------------------------------

export function ScaleView() {
  const queryClient = useQueryClient();

  const [weightScale, setWeightScale] = useState<number>(0);

  useEffect(() => {
    // each time gen a random number
    setTimeout(() => {
      setWeightScale(Math.floor(Math.random() * 100000));
    }, 500);
  });

  const functions = [
    {
      name: 'Cân Hàng + Xe',
      icon: 'mingcute:scale',
      weight: () => { console.log('123') },
    },
    {
      name: 'Cân Xác Xe',
      icon: 'mingcute:scale',
      weight: () => { console.log('123') }
    },
    {
      name: 'Phiếu cân',
      icon: 'mingcute:scale',
      weight: () => { console.log('123') },
      func: (value) => {
        isOpenPrint(true);  
      }
    },
    {
      name: 'Phiếu cân',
      icon: 'mingcute:scale',
      weight: () => { console.log('123') }
    },
    {
      name: 'Phiếu cân',
      icon: 'mingcute:scale',
      weight: () => { console.log('123') }
    },
    {
      name: 'Phiếu cân',
      icon: 'mingcute:scale',
      weight: () => { console.log('123') }
    },
    {
      name: 'Phiếu cân',
      icon: 'mingcute:scale',
      weight: () => { console.log('123') }
    },
    {
      name: 'Phiếu cân',
      icon: 'mingcute:scale',
      weight: () => { console.log('123') }
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
          {functions.map((item) => (
            <Grid item xs={3} md={3}>
              <Button size='large' variant='contained' fullWidth onClick={item.func}>{item.name}</Button>
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
        checkboxSelection
        disableRowSelectionOnClick

      />

      <TicketModal open={openPrint} onClose={() => isOpenPrint(false)} ticketData={{customer_name: "123", wh_id: 1}}/>
    </DashboardContent>
  );
}

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];