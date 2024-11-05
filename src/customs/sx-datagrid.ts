import { createTheme } from '@mui/material';

const sxDataGrid = {
  '.MuiDataGrid-columnSeparator': {
    color: '#d5e5fa',
  },
  '& .MuiDataGrid-row': {
    border: '0.1px solid #d5e5fa',
    borderRight: 0,
    borderTop: 0,
  },
  '.MuiDataGrid-withBorderColor': {
    border: 'none',
  },
  '&.MuiDataGrid-root': {
    border: 'none',
  },
};

export const sxSelectorDataGrid = {
  '.MuiDataGrid-columnSeparator': {
    color: 'grey.400',
  },
  '.MuiDataGrid-withBorderColor': {
    border: 'grey.300',
  },
  '&.MuiDataGrid-root': {
    border: 'none',
  },
};

export const filterColumnTheme = createTheme({
  components: {
    // @ts-ignore - this isn't in the TS because DataGird is not exported from `@mui/material`
    MuiDataGrid: {
      styleOverrides: {
        row: {
          '&.Mui-selected': {
            backgroundColor: 'white',
            color: 'none',
            '&:hover': {
              backgroundColor: 'white',
            },
          },
        },
      },
    },
  },
});

export default sxDataGrid;
