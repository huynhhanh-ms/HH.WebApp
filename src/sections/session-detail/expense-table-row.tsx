import type { Expense } from 'src/domains/dto/expense';

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

import { fNumber } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { ApiQueryKey } from 'src/services/api-query-key';
import { ExpenseApi } from 'src/services/api/expense.api';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import DeleteDialog from '../tank/delete-dialog';

import type { TableRowProps } from '../tank/utils';

// ----------------------------------------------------------------------
export function ExpenseTableRow({ row, selected, onSelectRow }: TableRowProps<Expense>) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // delete expense
  const queryClient = useQueryClient();
  const { mutateAsync: deleteExpense } = useMutation({
    mutationFn: ExpenseApi.delete,
    onSuccess: () => {
      enqueueSnackbar('Xóa thành công', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.session] });
    },
    onError: (error) => {
      enqueueSnackbar('Xóa thất bại', { variant: 'error' });
    }
  });
  const handleDelete = useCallback(() => {
    deleteExpense(row.id);
    handleClosePopover();
  }, [deleteExpense, handleClosePopover, row.id]);

  // delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDeleteDialog = () => {
    setOpenDeleteDialog(true);
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>



        <TableCell>#{row.id}</TableCell>
        <TableCell>{row.expenseTypeName}</TableCell>
        <TableCell>{row.debtor}</TableCell>
        <TableCell>{row.note}</TableCell>
        <TableCell>{fNumber(row.amount)}</TableCell>
        <TableCell>{fDateTime(row.createdAt, "hh:mm")}</TableCell>
        <TableCell>{row.image}</TableCell>


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
            width: 140,
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
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Sửa
          </MenuItem>

          <MenuItem onClick={handleDeleteDialog} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </Popover>
      <DeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} onConfirm={handleDelete} />
    </>
  );
}

