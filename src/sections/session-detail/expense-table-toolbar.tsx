import { useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Box, Button, CardActions } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import CreateExpenseModal from './expense-create-modal';

// ----------------------------------------------------------------------

type TableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ExpenseTableToolbar({ numSelected, filterName, onFilterName }: TableToolbarProps) {

  const [isOpenCreateExpense, setIsOpenCreateExpense] = useState(false);

  return (
    <>
      {isOpenCreateExpense && <CreateExpenseModal open={isOpenCreateExpense} onClose={() => setIsOpenCreateExpense(false)} />}
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          // justifyContent: 'space-between',
          p: (theme) => theme.spacing(0, 1, 0, 3),
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        <Typography variant='subtitle1' fontWeight='bold' marginRight='auto'>
          Chi Phí
        </Typography>

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        )}

        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <OutlinedInput
            // fullWidth
            size='small'
            value={filterName}
            onChange={onFilterName}
            placeholder="Tìm kiếm..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
        )}


        <Box width={10} />

        <Button variant='contained' color='inherit' startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setIsOpenCreateExpense(true)}
        >
          Tạo
        </Button>
      </Toolbar>

    </>
  );
}

