import type { Session } from 'src/domains/dto/session';

import { enqueueSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';
import { fNumber, fCurrency, fShortenNumber } from 'src/utils/format-number';

import { ApiQueryKey } from 'src/services/api-query-key';
import { SessionApi } from 'src/services/api/session.api';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import DeleteDialog from '../tank/delete-dialog';

import type { TableRowProps } from '../tank/utils';


export function SessionTableRow({ row, selected, onSelectRow }: TableRowProps<Session>) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const [openDelete, setOpenDelete] = useState(false);
  const handleDeleteDialog = () => {
    setOpenDelete(true);
  }

  const queryClient = useQueryClient();
  const {mutateAsync: deleteSession } = useMutation({
    mutationFn: SessionApi.delete,
    mutationKey: [ApiQueryKey.session],
    onSuccess: () => {
      setOpenDelete(false);
      enqueueSnackbar('Xóa đợt chốt thành công', { variant: 'success' });
      queryClient.invalidateQueries({queryKey: [ApiQueryKey.session]});
    },
    onError: (error) => {
      enqueueSnackbar('Xóa đợt chốt thất bại', { variant: 'error' });
    }
  });

  // Open session detail
  const router = useRouter();
  const handleOpenSessionDetail = () => {
    router.push(`/admin/session/${row.id}`);
  };

  // console.table(
  //   row?.petrolPumps?.map(pumps => pumps.totalVolume)
  // );
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleOpenSessionDetail}>

        <TableCell>#{row.id}</TableCell>

        <TableCell>{fDateTime(row.startDate)}</TableCell>


        <TableCell>{fCurrency(row?.petrolPumps?.reduce((pre, cur, idx) => pre + cur.revenue, 0))}</TableCell>
        <TableCell>{row?.petrolPumps?.every(pump => pump.totalVolume === 0 || pump.totalVolume == null) ? "" : row?.petrolPumps?.map(pumps => pumps.totalVolume).join('/')}</TableCell>
        <TableCell>{fDateTime(row.endDate)}</TableCell>
        <TableCell>
          <Label color={(row.status === 'Processing' && 'warning') || 'success'}>{
            row.status === 'Processing' ? 'Đang thực hiện' : 'Đóng'
          }</Label>
        </TableCell>


        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 200,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleDeleteDialog} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa đợt chốt
          </MenuItem>
          <DeleteDialog open={openDelete} onClose={() => setOpenDelete(false)} onConfirm={() => {
            deleteSession(row.id);
          }} />
        </MenuList>
      </Popover>
    </>
  );
}
