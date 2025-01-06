import type { Tank } from 'src/domains/dto/tank';

import { enqueueSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { TankApi } from 'src/services/api/tank.api';
import { ApiQueryKey } from 'src/services/api-query-key';

interface CreateTankModalProps {
  open: boolean;
  onClose: () => void;
  tanks: Tank[];
  // onSubmit?: (formValues: { tankId: string; importVolume: string; importPrice: string; weight: string; note: string}) => void;
}

const CreateTankHistoryModal: React.FC<CreateTankModalProps> = ({ open, onClose, tanks }) => {
  const [formValues, setFormValues] = useState<Tank[]>([]);

  useEffect(() => {
    setFormValues([...tanks]);
  }, [tanks]);

  // Handle changes in the form fields
  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    const newFormValues = formValues.map((tank) => {
      if (tank.id.toString() === name) {
        return {
          ...tank,
          currentVolume: Number(value)
        };
      }
      return tank;
    });
    setFormValues([ ...newFormValues ]
    );
  };

  // Create Fuel Import
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: TankApi.saveHistory,
    mutationKey: [ApiQueryKey.tank_history],
    onSuccess: () => {
      enqueueSnackbar('lưu bồn thành công', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.tank_history] });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.tank] })
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (formValues.every((tank) => tank.name !== '' && tank.name != null)) {
      await mutateAsync(formValues as any);
    } else {
      enqueueSnackbar('Vui lòng điền đầy đủ thông tin.', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tạo và lưu bồn chứa</DialogTitle>
      <DialogContent>
        {
          formValues.map((tank, index) => (
            <TextField
              key={tank.id}
              fullWidth
              margin="normal"
              label={tank.name}
              name={tank.id.toString()}
              value={tank.currentVolume}
              onFocus={event => { event.target.select(); }}
              onChange={handleChange}
              required
              type="number"
            />
          ))
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button onClick={handleSubmit} variant="contained">
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTankHistoryModal;
