import type { CardProps } from '@mui/material/Card';
import type { Session } from 'src/domains/dto/session';
import type { PetrolPump } from 'src/domains/dto/petrol-pump';
import type { GridColDef, GridRowsProp, GridAlignment } from '@mui/x-data-grid';

import { enqueueSnackbar } from 'notistack';
import { useMemo, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import sxDataGrid from 'src/customs/sx-datagrid';
import { ApiQueryKey } from 'src/services/api-query-key';
import { SessionApi } from 'src/services/api/session.api';

import { Iconify } from 'src/components/iconify';
import { Condition } from 'src/components/condition';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  pumps: PetrolPump[];
  sessionData?: Session;
};

export function RecordInitialMeter({ title, subheader, pumps: parentPumps, sessionData, ...other }: Props) {

  const [pumps, setPumps] = useState<PetrolPump[]>([]);
  useEffect(() => {
    setPumps(parentPumps);
  }, [parentPumps]);

  type PetrolPumpKeys = keyof PetrolPump;
  const keys: PetrolPumpKeys[] = useMemo(() => ['startVolume', 'endVolume', 'totalVolume', 'price', 'revenue'], []);
  const transKeys: string[] = useMemo(() => ['Bắt đầu', 'Kết thúc', 'Hiệu', 'Giá bán', 'Doanh số'], []);

  const [columns, setColumns] = useState<GridColDef[]>();

  const [rows, setRows] = useState<GridRowsProp>();

  useEffect(() => {
    setColumns([
      { field: 'calcName', minWidth: 120, headerName: 'Công tơ (Lít)', sortable: false, disableColumnMenu: true },
      ...pumps.map((item, index): GridColDef => ({
        field: `tankId${index}`,
        headerName: item?.tank?.name,
        type: 'number',
        editable: true,
        align: 'left',
        headerAlign: 'left',
        sortable: false,
      })),
    ]);
    setRows([
      ...keys.map((key, index) => {
        const row: any = { id: index };
        row.calcName = transKeys[index];
        pumps.forEach((item, i) => {
          row[`tankId${i}`] = item[key];
        });
        return row;
      })
    ]);
  }, [keys, pumps, transKeys]);


  const handleProcessRowUpdateError = (error: any): void => {
    enqueueSnackbar('Cập nhật không thành công', { variant: 'error' });
  }

  const handleRowUpdate = (newRow: any, oldRow: any) => {
    // update pumps from
    let newPumps = pumps.map((item, index): PetrolPump => ({
      ...item,
      [keys[newRow.id]]: newRow[`tankId${index}`],
    }));

    // calc total volume, revenue
    newPumps = newPumps.map((item, index): PetrolPump => ({
      ...item,
      totalVolume: item.endVolume - item.startVolume,
      revenue: (item.endVolume - item.startVolume) * item.price,
    }));

    // update state pumps
    setPumps(newPumps);
    return newRow;
  }

  // save data to server when update
  const { mutateAsync: saveSession } = useMutation({
    mutationKey: [ApiQueryKey.session],
    mutationFn: SessionApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.session] });
      enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
    },
    onError: (error) => {
      console.log('onError', error);
    }
  });
  const queryClient = useQueryClient();
  const handleSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();

    if (!sessionData) return;
    saveSession({
      ...sessionData,
      petrolPumps: pumps,
    });
  }

  // note
  const [note, setNote] = useState<string>('');
  useEffect(() => {
      setNote(sessionData?.note ?? '');
  }, [sessionData?.note]);
  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!sessionData) return;
    setNote(event.target.value);
    sessionData.note = event.target.value;
  }

  return (
    <Card {...other}>
      {/* <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} /> */}
      <DataGrid rows={rows} columns={columns ?? []} sx={sxDataGrid}
        processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        isCellEditable={(params) => [0, 1, 3].includes(parseInt(params.id.toString()))}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage >= 2 ? 'Mui-selected' : ''
        }
        autoHeight
        hideFooter
      />
      <div className='pt-2'/>
      <TextField
        sx={{ m:1, pr:2 }}
        label="Ghi chú (Không bắt buộc)"
        variant="outlined"
        multiline
        rows={3}
        fullWidth
        name='note'
        value={note}
        onFocus={event => { event.target.select(); }}
        onChange={handleChangeNote}
        type='text'
      // helperText="Thêm ghi chú (Không bắt buộc)"
      />
      <Box sx={{ p: 2, textAlign: 'right', display: 'flex', justifyContent: 'space-between' }}>
        <Condition condition={sessionData?.status !== "Closed"}>
          <Button size="small" color="inherit" variant='contained' onClick={handleSave} >
            Lưu
          </Button></Condition>
      </Box>
    </Card>
  );
}


