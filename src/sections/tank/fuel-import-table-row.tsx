import type { FuelImport } from 'src/domains/dto/fuel-import';

import { enqueueSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { fDateTime } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import { ApiQueryKey } from 'src/services/api-query-key';
import { FuelImportApi } from 'src/services/api/fuel-import.api';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import DeleteDialog from './delete-dialog';
import { ImportDetailDialog } from './import-detail-dialog';

import type { TableRowProps } from './utils';

// ----------------------------------------------------------------------


export function FuelImportTableRow({ row, selected, onSelectRow }: TableRowProps<FuelImport>) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const queryClient = useQueryClient();

  // edit fuel import row
  const handleEdit = useCallback(() => {
    handleClosePopover();
  }, [handleClosePopover]);

  // delete fuel import row
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const { mutateAsync: deleteFuelImport } = useMutation({
    mutationFn: FuelImportApi.delete,
    mutationKey: [ApiQueryKey.fuelImport],
    onSuccess: () => {
      enqueueSnackbar('Xóa đợt nhập thành công', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.fuelImport] });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.tank] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });
  const handleDelete = useCallback(() => {
    handleClosePopover();
    deleteFuelImport(row.id);
  }, [deleteFuelImport, handleClosePopover, row.id]);
  const handleOpenDeleteModal = useCallback(() => {
    setIsOpenDeleteDialog(true);
    handleClosePopover();
  }, [handleClosePopover]);

  const [openDetail, setOpenDetail] = useState<FuelImport | undefined>();
  const handleViewDetail = (event: any): void => {
    setOpenDetail(row);
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected} onClick={handleViewDetail}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          #{row?.id}
        </TableCell>

        <TableCell>{row?.tank.name}</TableCell>

        <TableCell>{fDateTime(row?.importDate)}</TableCell>
        <TableCell>
          <Label color={((row.status === 'Closed') && 'warning') || 'success'}>{
            row.status === 'Closed' ? 'đã hết' : 'còn'
          }</Label>
        </TableCell>
        <TableCell align="right">{[fNumber(row?.volumeUsed),fNumber(row?.importVolume)].join('/')}</TableCell>
        <TableCell align="right">{fCurrency(row?.importPrice)}</TableCell>
        <TableCell align="right">{fCurrency(row?.totalCost)}</TableCell>
        <TableCell align="right">{fCurrency(row?.totalSalePrice)}</TableCell>
        <TableCell align="right">{fCurrency((row?.totalSalePrice ?? 0) - (row?.totalCost ?? 0))}</TableCell>
        <TableCell align="left">{row?.note}</TableCell>
        <TableCell align="right">{fNumber(row?.weight)}</TableCell>
        <TableCell align="right">{row?.weight && row?.importVolume ? fNumber(row.weight / row.importVolume) : '-'}</TableCell>


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

          <MenuItem onClick={handleOpenDeleteModal} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </Popover>

      <DeleteDialog
        open={isOpenDeleteDialog}
        onClose={() => setIsOpenDeleteDialog(false)}
        onConfirm={() => handleDelete()}
      />
      <ImportDetailDialog data={openDetail} open={openDetail !== undefined} onClose={() => setOpenDetail(undefined)}/>
    </>
  );

}