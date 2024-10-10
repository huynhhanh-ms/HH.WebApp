import type { Tank } from 'src/domains/dto/tank';
import type { Expense } from 'src/domains/dto/expense';

import { enqueueSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Dialog, Button, Select, MenuItem, TextField, InputLabel, DialogTitle, FormControl, DialogContent, DialogActions } from '@mui/material';

import { ApiQueryKey } from 'src/services/api-query-key';
import { ExpenseApi } from 'src/services/api/expense.api';
import { ExpenseTypeApi } from 'src/services/api/expense-type.api';

interface CreateExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (formValues: { tankId: string; importVolume: string; importPrice: string; weight: string }) => void;
}

const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({ open, onClose, onSubmit }) => {

  // fetch expense tank
  const { data: expenseTypeData } = useQuery({
    queryFn: ExpenseTypeApi.gets,
    queryKey: [ApiQueryKey.expenseType]
  });

  // State to handle form values
  const { sessionId } = useParams();
  const [formValues, setFormValues] = useState<Expense>({
    id: 0,
    sessionId: 0,
    expenseTypeId: 0,
    expenseTypeName: "",
    amount: 0,
    note: "",
    debtor: "",
    image: "",
    createdAt: new Date(),
  });
  useEffect(() => {
    setFormValues({
      id: 0,
      sessionId: sessionId ? parseInt(sessionId) : 0,
      expenseTypeId: 0,
    expenseTypeName: "",
      amount: 0,
      note: "",
      debtor: "",
      image: "",
      createdAt: new Date(),
    });
  }, [sessionId]);


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
    mutationFn: ExpenseApi.create,
    mutationKey: [ApiQueryKey.expense],
    onSuccess: () => {
      enqueueSnackbar('Tạo khoản phí thành công', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.expense] });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.tank] })
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.session] })
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (formValues.expenseTypeId && formValues.amount && formValues.debtor) {
      await mutateAsync(formValues as any);
    } else {
      enqueueSnackbar('Vui lòng điền đầy đủ thông tin.', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tạo khoản phí</DialogTitle>
      <DialogContent>
        {/* expensetype Select Box */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Loại phí</InputLabel>
          <Select
            name="expenseTypeId"
            value={formValues.expenseTypeId}
            onChange={handleChange}
            label=""
            required
          >
            {expenseTypeData?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/*  Người đưa nhận */}
        <TextField
          fullWidth
          margin="normal"
          label="Người đưa/nhận"
          name="debtor"
          value={formValues.debtor}
          onChange={handleChange}
          required
          type="text"
        />

        <TextField
          fullWidth
          margin="normal"
          label="Mô tả chi tiết"
          name="note"
          value={formValues.note}
          onChange={handleChange}
          type="text"
        />

        <TextField
          fullWidth
          margin="normal"
          label="Số tiền"
          name="amount"
          value={formValues.amount}
          onChange={handleChange}
          type="number"
          required
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

export default CreateExpenseModal;
