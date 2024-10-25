
import React, { useRef, Component } from 'react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';

import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { Printable } from './printable';

interface Props {
  open: boolean;
  onClose: () => void;
  ticketData: WeighingHistory;
}






function TicketModal({ open, onClose, ticketData }: Props) {
  const handlePrint1 = () => {
    window.print();
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });
  


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Phiếu Cân</DialogTitle>
      <DialogContent>
        {/* <style type="text/css" media="print">{"\
          @page { size: portrait; }\
        "}</style> */}
        <div>
          <Printable innerRef={contentRef} />
        </div>
      </DialogContent>
      <DialogActions>
        {/* Nút để in hợp đồng */}
          <Button onClick={() => handlePrint()}>Print</Button>
        <Button onClick={handlePrint1} color="primary" variant="contained">
          In
        </Button>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TicketModal;
