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
      weight: () => { console.log('123') }
    },
    {
      name: 'Cân Xác Xe',
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

  return (
    <DashboardContent maxWidth='xl'>
      <Grid container spacing={3} mb={2}>
        {/* Button in Left */}
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
                <Button size='large' variant='contained' fullWidth>{item.name}</Button>
            </Grid>
          ))}

        </Grid>
      </Grid>

      {/* <Grid container spacing={3} sx={{ mb: { xs: 2, md: 3 } }}>
        <Grid item xs={12} sm={6} md={3} >
          {gasoline &&
            <AnalyticsTankVolume
              title={gasoline.name}
              percent={Math.ceil(gasoline.currentVolume / gasoline.capacity * 100)}
              // percent={14.2} 
              total={gasoline.currentVolume}
              color='success'
              icon={<img alt="icon" src="/assets/icons/tank/xang.svg" />}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [22, 8, 35, 50, 82, 84, 77, 12],
              }}
            />
          }
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {diesel &&
            <AnalyticsTankVolume
              title={diesel.name}
              percent={diesel.currentVolume / diesel.capacity * 100}
              total={diesel.currentVolume}
              color='warning'
              icon={<img alt="icon" src="/assets/icons/tank/dau.svg" />}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [22, 8, 35, 50, 82, 84, 77, 12],
              }}
            />}
        </Grid>
      </Grid> */}

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