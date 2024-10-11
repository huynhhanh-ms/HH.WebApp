import React from 'react';

import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface ChickiesDialogProps {
  title: string;
  description: string;
  closeText: string;
  confirmText: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ChickiesDialog = ({ title, description, closeText, confirmText, open, onClose, onConfirm } : ChickiesDialogProps) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
      {description}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
        {closeText}
        </Button>
        <Button 
          onClick={() => {
            onConfirm(); // Gọi hàm xác nhận khi nhấn nút Xóa
            onClose(); // Đóng modal
          }} 
          color="inherit">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );

export default ChickiesDialog;
