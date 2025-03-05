import type { CreatedLand } from "src/domains/dto/land";

import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button, Select, MenuItem, TextField, InputLabel, FormControl } from "@mui/material";

import { useLand } from "src/stores/use-land";
import { LandType } from "src/domains/dto/land";
import { LandApi } from "src/services/api/land.api";
import { ApiQueryKey } from "src/services/api-query-key";


const LandCreateModel: React.FC = () => {

  const queryClient = useQueryClient();
  // State để lưu form data
  const [formData, setFormData] = useState<CreatedLand>({
    name: "",
    type: LandType.Default,
    location: {
      type: "Point",
      coordinates: [[[]]]
    }
  });
  const { points, resetPoints } = useLand();


  const { mutateAsync: createLandApi, isPending } = useMutation({
    mutationFn: LandApi.create,
    mutationKey: [ApiQueryKey.land],
    onSuccess: () => {
      enqueueSnackbar("Tạo vùng đất thành công", { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.land] });
      resetPoints();
    },
    onError: () => {
      enqueueSnackbar("Tạo vùng đất thất bại", { variant: 'error' });
    }
  });

  // Xử lý thay đổi giá trị input
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi số (area, tọa độ)
  const handleNumberChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseFloat(value) : undefined,
    }));
  };

  // Xử lý chọn loại đất
  const handleSelectChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      type: e.target.value as LandType,
    }));
  };



  // Submit form
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const pointsWithLast = [...points, points[0]];
    formData.location.coordinates = [pointsWithLast];
    createLandApi(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      {/* Tên đất */}
      <TextField name="name" label="Tên đất" fullWidth margin="normal" value={formData.name} onChange={handleChange} required />

      {/* Loại đất */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Loại đất</InputLabel>
        <Select name="type" value={formData.type} onChange={handleSelectChange}>
          {Object.values(LandType).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Diện tích */}
      <TextField name="area" label="Diện tích (m²)" type="number" fullWidth margin="normal" value={formData.area || ""} onChange={handleNumberChange} />

      {/* Vị trí (tọa độ) */}
      {/* <TextField name="lat" label="Vĩ độ (Latitude)" type="number" fullWidth margin="normal" value={formData.location.lat} onChange={handleNumberChange} />
      <TextField name="lng" label="Kinh độ (Longitude)" type="number" fullWidth margin="normal" value={formData.location.lng} onChange={handleNumberChange} /> */}

      {/* Nút Submit */}
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={isPending}>
        {isPending ? "Đang lưu..." : "Thêm đất"}
      </Button>
    </form>
  );
};

export default LandCreateModel;
