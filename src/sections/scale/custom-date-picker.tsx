// import { format } from 'date-fns';
import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { Box, TextField } from '@mui/material';
import { deDE } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';



interface Props {
  title?: string;
  date?: Date;
  setDate?: (date: Date) => any; 
}

const CustomDatePicker = ({title = 'Chọn ngày', date, setDate}: Props) => {
  const handleDateChange = (newDate) => {
    setDate?.(newDate.toDate());
  };

  // const formatDate = (date) => date ? dayjs(date).format('dd/MM/yyyy') : '';
  // const formatedDate = dayjs(date).format("MMMM DD, YYYY hh:mm A");

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker label={title}

            value={dayjs(date)}
            onChange={handleDateChange}
            slotProps={{ textField: { fullWidth: true } }}
            format='DD/MM/YYYY'
            disableFuture
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
};

export default CustomDatePicker;
