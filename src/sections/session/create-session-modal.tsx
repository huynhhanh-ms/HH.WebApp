
import type { Tank } from 'src/domains/dto/tank';
import type { Session } from 'src/domains/dto/session';
import type { PetrolPump } from 'src/domains/dto/petrol-pump';

import { enqueueSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { TankApi } from 'src/services/api/tank.api';
import { ApiQueryKey } from 'src/services/api-query-key';
import { SessionApi } from 'src/services/api/session.api';
import { FuelImportApi } from 'src/services/api/fuel-import.api';

interface CreateSessionModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ open, onClose }) => {

  // get tank
  const { data: tanks } = useQuery({
    queryKey: [ApiQueryKey.tank],
    queryFn: TankApi.gets,
  });

  const mapTanksToPetrolPump = (source: Tank[]): PetrolPump[] => source.map((tank): PetrolPump => ({
    id: 0,
    sessionId: 0,
    tankId: tank.id,
    startVolume: 0,
    endVolume: 0,
    totalVolume: 0,
    revenue: 0,
    price: 0,
  }))

  // State to handle form values
  const [formValues, setFormValues] = useState<Session>({
    id: 0,
    cashForChange: 0,
    startDate: '',
    endDate: '',
    totalRevenue: 0,
    petrolPumps: mapTanksToPetrolPump(tanks ?? []),
    status: '',
    volumeSold: 0,
  });

  useEffect(() => {
    formValues.petrolPumps = mapTanksToPetrolPump(tanks ?? []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tanks]);

  const handleChangePetrolPump = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    const [field, index, key] = name.split('.'); // Sử dụng format như 'petrolPump.0.revenue'
    setFormValues(prevValues => ({
      ...prevValues,
      petrolPumps: prevValues.petrolPumps.map((pump, idx) =>
        idx === Number(index) ? { ...pump, [key]: value } : pump
      )
    }));
  };

  // Handle changes in the form fields
  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    console.log(formValues);
    console.log(name);
    console.log(value);
  };

  // Create session
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: SessionApi.create,
    mutationKey: [ApiQueryKey.session],
    onSuccess: async (data) => {
      enqueueSnackbar('Tạo đợt chốt thành công', { variant: 'success' });
      await queryClient.invalidateQueries({ queryKey: [ApiQueryKey.session] })
      // onClose();
      router.push(`/admin/session/${data}`);
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (formValues.petrolPumps.every(pump => pump.startVolume > 0)) {
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
        {
          formValues.petrolPumps.map((pump, index) => (
            <TextField
              key={index}
              fullWidth
              margin="normal"
              label={`Số lít đầu buổi: ${  tanks![index].name ?? `Bồn ${index + 1}`}`}
              onFocus={event => { event.target.select(); }}
              name={`petrolPump.${index}.startVolume`}
              value={formValues.petrolPumps[index]?.startVolume}
              onChange={handleChangePetrolPump}
              required
              type="number"
            />
          ))
        }

        {/* Weight (Optional) */}
        <TextField
          fullWidth
          margin="normal"
          onFocus={event => { event.target.select(); }}
          label="Tiền lẻ ban đầu (Không bắt buộc)"
          name="cashForChange"
          value={formValues.cashForChange}
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
