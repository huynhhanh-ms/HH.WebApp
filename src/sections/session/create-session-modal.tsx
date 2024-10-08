
import React, { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { ApiQueryKey } from 'src/services/api-query-key';
import { FuelImportApi } from 'src/services/api/fuel-import.api';

interface CreateSessionModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ open, onClose}) => {
  // State to handle form values
  const [formValues, setFormValues] = useState({
    tankId: '',
    importVolume: '',
    importPrice: '',
    weight: ''
  });

  // Handle changes in the form fields
  const handleChange = (event: { target: { name: any; value: any; }; }) => {
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
      <DialogTitle>Tạo đợt chốt sổ</DialogTitle>
      <DialogContent>
        {/* Import Volume */}
        <TextField
          fullWidth
          margin="normal"
          label="Thể tích (lít)"
          name="importVolume"
          value={formValues.importVolume}
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
          required
          type="number"
        />

        {/* Weight (Optional) */}
        <TextField
          fullWidth
          margin="normal"
          label="Trọng lượng cân (kg) (Không bắt buộc)"
          name="weight"
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

export default CreateSessionModal;
