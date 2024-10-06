import type { Tank } from 'src/domains/dto/tank';
import type { FuelImport } from 'src/domains/dto/fuel-import';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { TankApi } from 'src/services/api/tank.api';
import { DashboardContent } from 'src/layouts/dashboard';
import { ApiQueryKey } from 'src/services/api-query-key';
import { FuelImportApi } from 'src/services/api/fuel-import.api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { FuelImportTableRow } from '../fuel-import-table-row';
import { AnalyticsTankVolume } from '../analytics-tank-volume';
import { emptyRows, applyFilter, getComparator } from '../utils';


// ----------------------------------------------------------------------

export function TankView() {
  const table = useTable();

  //* useTank call data
  const [tank, setTank] = useState<Tank[]>();
  const [gasoline, setGasoline] = useState<Tank>();
  const [diesel, setDiesel] = useState<Tank>();

  const { data: tankResponse, isSuccess } = useQuery({
    queryKey: [ApiQueryKey.tank],
    queryFn: TankApi.gets,
  });

  useEffect(() => {
    if (isSuccess) {
      setTank(tankResponse);
      setGasoline(tankResponse[0]);

      setDiesel(tankResponse[1]);
    }
  }, [isSuccess, tankResponse, gasoline?.currentVolume, gasoline?.capacity]);

  //* useFuelImport call data
  const { data: fuelImportResponse } = useQuery({
    queryKey: [ApiQueryKey.fuelImport],
    queryFn: FuelImportApi.gets,
  });

  useEffect(() => {
    if (fuelImportResponse) {
      console.log(fuelImportResponse);
    }
  }, [fuelImportResponse]);


  const [filterName, setFilterName] = useState('');

  const dataFiltered: FuelImport[] = applyFilter({
    inputData: fuelImportResponse || [],
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent maxWidth='xl'>
      <Typography variant="h4" sx={{ mb: { xs: 2, md: 3 } }}>
        Quản lý tồn kho
        <Button variant='outlined' sx={{ ml: 2 }} color='inherit'>
          Đồng bộ giá bán
        </Button>
      </Typography>

      <Grid container spacing={3} className='sm:mb-10 md:mb-10'>
        <Grid item xs={12} sm={6} md={3} >
          {gasoline &&
            <AnalyticsTankVolume
              title="Xăng"
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
            title="Dầu"
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
      </Grid>

      <Box display="flex" alignItems="center" mb={3}>
        <Typography variant="h4" flexGrow={1}>
          Đợt nhập
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Thêm đợt nhập
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={fuelImportResponse?.length ?? 0}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    fuelImportResponse?.map((user) => user.id.toString()) ?? []
                  )
                }
                headLabel={[
                  { id: 'id', label: 'Mã' },
                  { id: 'tankName', label: 'Bồn chứa' },
                  { id: 'importDate', label: 'Ngày nhập' },
                  { id: 'isVerified', label: 'Verified', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <FuelImportTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id.toString())}
                      onSelectRow={() => table.onSelectRow(row.id.toString())}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, fuelImportResponse?.length ?? 0)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={fuelImportResponse?.length ?? 0}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
