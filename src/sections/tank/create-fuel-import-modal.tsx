import type { Tank } from 'src/domains/dto/tank';

import React, { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Dialog, Button, Select, MenuItem, TextField, InputLabel, DialogTitle, FormControl, DialogContent, DialogActions } from '@mui/material';

import { ApiQueryKey } from 'src/services/api-query-key';
import { FuelImportApi } from 'src/services/api/fuel-import.api';

interface CreateFuelImportModalProps {
  open: boolean;
  onClose: () => void;
  tanks: Tank[];
  // onSubmit?: (formValues: { tankId: string; importVolume: string; importPrice: string; weight: string; note: string}) => void;
}

const CreateFuelImportModal: React.FC<CreateFuelImportModalProps> = ({ open, onClose, tanks }) => {
  // State to handle form values
  const [formValues, setFormValues] = useState({
    tankId: '',
    importVolume: '',
    importPrice: '',
    note: "",
    weight: 0,
  });

  // Handle changes in the form fields
  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    // console.log(event.target.name);
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Create Fuel Import
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: FuelImportApi.create,
    mutationKey: [ApiQueryKey.fuelImport],
    onSuccess: () => {
      enqueueSnackbar('Tạo đợt nhập thành công', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.fuelImport] });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.tank] })
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (formValues.importVolume && formValues.importPrice && formValues.tankId) {
      await mutateAsync(formValues as any);
    } else {
      enqueueSnackbar('Vui lòng điền đầy đủ thông tin.', { variant: 'error' });
    }
  };





  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tạo đợt nhập</DialogTitle>
      <DialogContent>
        {/* Tank ID Select Box */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Bồn</InputLabel>
          <Select
            name="tankId"
            value={formValues.tankId}
            onChange={handleChange}
            label="Tank"
            required
          >
            {tanks.map((tank) => (
              <MenuItem key={tank.id} value={tank.id}>
                {tank.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Import Volume */}
        <TextField
          fullWidth
          margin="normal"
          label="Thể tích (lít)"
          name="importVolume"
          value={formValues.importVolume}
          onFocus={event => { event.target.select(); }}
          onChange={handleChange}
          required
          type="number"
        />

        {/* Import Price */}
        <TextField
          fullWidth
          margin="normal"
          label="Giá nhập (VND) (Sau khi trừ hoa hồng)"
          name="importPrice"
          value={formValues.importPrice}
          onChange={handleChange}
          onFocus={event => { event.target.select(); }}
          required
          type="number"
        />

        {/* Note Input */}
        <TextField
          label="Ghi chú (Không bắt buộc)"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          name='note'
          value={formValues.note}
          onFocus={event => { event.target.select(); }}
          onChange={handleChange}
          type='text'
        // helperText="Thêm ghi chú (Không bắt buộc)"
        />

        {/* Weight (Optional) */}
        <TextField
          fullWidth
          margin="normal"
          label="Trọng lượng cân (kg) (Không bắt buộc)"
          name="weight"
          onFocus={event => { event.target.select(); }}
          value={formValues.weight}
          onChange={handleChange}
          type="number"
        />
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

export default CreateFuelImportModal;
