import type { Expense } from 'src/domains/dto/expense';

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
import { Grid, Divider, Container, CardHeader, CardActions } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { ApiQueryKey } from 'src/services/api-query-key';
import { SessionApi } from 'src/services/api/session.api';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useTable } from 'src/sections/tank/view';
import { GeneralTableHead } from 'src/sections/tank/user-table-head';
import { emptyRows, applyFilter, getComparator } from 'src/sections/tank/utils';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { TotalCalcBoard } from '../total-calc-board';
import { ExpenseTableRow } from '../expense-table-row';
import { RecordInitialMeter } from '../record-initial-meter';
import { ExpenseTableToolbar } from '../expense-table-toolbar';

// ----------------------------------------------------------------------

export function SessionDetailView() {
  const table = useTable();

  // Get session detail
  const { sessionId } = useParams();
  const { data: sessionData } = useQuery({
    queryKey: [ApiQueryKey.session],
    queryFn: () => SessionApi.get(parseInt(sessionId ?? '0')),
  });

  // Get expenses from session - table
  const [filterName, setFilterName] = useState('');
  const dataFiltered: Expense[] = applyFilter({
    inputData: sessionData?.expenses ?? [],
    comparator: getComparator(table.order, table.orderBy),

    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

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

        <Grid xs={12} sm={6} md={6} padding="20px" item>
          <Card className=''>
            <TotalCalcBoard />
          </Card>
        </Grid>

      </Grid>

      <Card>
        <ExpenseTableToolbar
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
              <GeneralTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={sessionData?.expenses?.length ?? 0}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    (sessionData?.expenses ?? []).map((expense) => expense.id.toString())
                  )
                }
                headLabel={[
                  { id: 'id', label: 'Mã' },
                  { id: 'expenseTypeName', label: 'Loại' },
                  { id: 'debtor', label: 'Người đưa/nhận' },
                  { id: 'note', label: 'Chi tiết' },
                  { id: 'amount', label: 'Số tiền' },
                  { id: 'createdAt', label: 'Giờ' },
                  { id: 'image', label: 'Ảnh' },
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
                    <ExpenseTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id.toString())}
                      onSelectRow={() => table.onSelectRow(row.id.toString())}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, sessionData?.expenses?.length ?? 0)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          labelRowsPerPage="Số hàng mỗi trang"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}

          component="div"
          page={table.page}
          count={sessionData?.expenses?.length ?? 0}
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