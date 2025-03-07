
import type { Session } from 'src/domains/dto/session';

import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { TankApi } from 'src/services/api/tank.api';
import { DashboardContent } from 'src/layouts/dashboard';
import { ApiQueryKey } from 'src/services/api-query-key';
import { SessionApi } from 'src/services/api/session.api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useTable } from 'src/sections/tank/view';
import { GeneralTableHead } from 'src/sections/tank/user-table-head';

import { TableNoData } from '../table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { SessionTableRow } from '../session-table-row';
import CreateSessionModal from '../create-session-modal';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../tank/utils';

// ----------------------------------------------------------------------

export function SessionView() {
  const table = useTable();

  // Fetch Session data
  const { data: sessionData } = useQuery({
    queryKey: [ApiQueryKey.session],
    queryFn: SessionApi.gets,
  });

  // Filter data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterName, setFilterName] = useState('');
  const dataFiltered: Session[] = applyFilter({
    inputData: sessionData ?? [],
    comparator: getComparator(table.order, table.orderBy),

    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  // create session modal
  const [openCreateSession, setOpenCreateSession] = useState(false);
  const handleCreateSession = () => {
    if (!tanks || tanks.length === 0) {
      enqueueSnackbar('bạn thực hiện quá nhanh, vui lòng bấm lại', { variant: 'warning' });
      return;
    }
    mutateAsync({
      cashForChange: 0,
      startDate: '',
      endDate: '',
      totalRevenue: 0,
      petrolPumps: tanks?.map((tank) => ({
        tankId: tank.id,
      })),
      status: '',
    } as any);
    // setOpenCreateSession(true);
  }

  // get tank
  const { data: tanks } = useQuery({
    queryKey: [ApiQueryKey.tank],
    queryFn: TankApi.gets,
  });
  // Create session
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: SessionApi.create,
    mutationKey: [ApiQueryKey.session],
    onSuccess: async (data) => {
      enqueueSnackbar('Tạo đợt chốt thành công', { variant: 'success' });
      await queryClient.invalidateQueries({ queryKey: [ApiQueryKey.session] })
      // onClose();
      router.push(`/admin/session/${data}`);
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });



  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Danh sách chốt sổ
        </Typography>

        <Button variant="contained" color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleCreateSession}
        >
          Tạo mới
        </Button>
      </Box>

      {openCreateSession && <CreateSessionModal
        open={openCreateSession}
        onClose={() => setOpenCreateSession(false)}
      />}

      <Card>
        {/* <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        /> */}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <GeneralTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={sessionData?.length ?? 0}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    (sessionData ?? []).map((item) => item.id.toString())
                  )
                }
                isMultiSelect={false}
                headLabel={[
                  { id: 'name', label: 'Mã' },
                  { id: 'startDate', label: 'Ngày tạo' },
                  // { id: 'totalRevenue', label: 'Tổng bán' },
                  { id: 'totalRevenue', label: 'Doanh số' },
                  { id: 'volumeSold', label: 'Số lít' },
                  { id: 'endDate', label: 'Ngày đóng' },
                  { id: 'status', label: 'Trạng thái' },
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
                    <SessionTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id.toString())}
                      onSelectRow={() => table.onSelectRow(row.id.toString())}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, sessionData?.length ?? 0)}
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
          count={sessionData?.length ?? 0}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}