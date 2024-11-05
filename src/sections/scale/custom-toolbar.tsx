import { Box } from "@mui/material";
import { GridToolbarExport, GridToolbarContainer, GridToolbarQuickFilter, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarDensitySelector } from "@mui/x-data-grid";

export function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter
      
      sx={{ 
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '4px 8px',
        width: '250px'
    }}
     />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector
        slotProps={{ tooltip: { title: 'Change density' } }}
      />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarExport
        slotProps={{
          tooltip: { title: 'Export data' },
          button: { variant: 'outlined' },
        }}
      />
    </GridToolbarContainer>
  );
}