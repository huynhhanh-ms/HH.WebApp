import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Grid, Divider, Container, CardHeader } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { ApiQueryKey } from 'src/services/api-query-key';
import { SessionApi } from 'src/services/api/session.api';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { TotalCalcBoard } from '../total-calc-board';
import { UserTableToolbar } from '../user-table-toolbar';
import { RecordInitialMeter } from '../record-initial-meter';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function SessionDetailView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: UserProps[] = applyFilter({
    inputData: _users,
    comparator: getComparator(table.order, table.orderBy),

    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  // Get session detail
  const { sessionId } = useParams();
  const { data: sessionData } = useQuery({
    queryKey: [ApiQueryKey.session],
    queryFn: () => SessionApi.get(parseInt(sessionId ?? '0')),
  });

  // Nav
  const router = useRouter();

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>

        {/* previous date */}
        <Button color="inherit" sx={{ maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px' }}
          onClick={() => router.push("/admin/session")} >
          <Iconify icon="mingcute:left-fill" width="100" height="100" style={{ color: "#1c252e" }} />
        </Button>

        <Typography variant="h4" flexGrow={1}>
          Chốt sổ #{sessionId}
          {'  '}
          <Label color={(sessionData?.status === 'Processing' && 'warning') || 'success'}>{
            sessionData?.status === 'Processing' ? 'Đang thực hiện' : 'Đóng'
          }</Label>
        </Typography>

        {/* previous date */}
        {/* <Button color="inherit" sx={{ maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px' }} >
          <Iconify icon="mingcute:left-fill" width="48" height="48" style={{ color: "#1c252e" }} />
        </Button> */}


        <Button variant="contained" color="inherit"
          // startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push('/admin/session')}
        >
          {fDateTime(sessionData?.startDate, 'DD/MM/YYYY')}
        </Button>

        {/* next date */}
        {/* <Button color="inherit" sx={{ maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px' }} >
          <Iconify icon="mingcute:right-fill" width="48" height="48" style={{ color: "#1c252e" }} />
        </Button> */}

      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={4} item>
          <RecordInitialMeter
            title='Công tơ'
            pumps={sessionData?.petrolPumps ?? []}
            sessionData={sessionData}
          />
        </Grid>

        <Grid xs={12} sm={6} md={6} padding="20px">
          <Card className=''>
            <TotalCalcBoard/>
          </Card>
        </Grid>

      </Grid>

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
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'company', label: 'Company' },
                  { id: 'role', label: 'Role' },
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
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_users.length}
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
