
import type { WeighingHistory } from 'src/domains/dto/weighing-history';

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
  // const handlePrint1 = () => {
  //   window.print();
  // };

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  // console.log(ticketData.id);



  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{
      sx: {
        minHeight: 600,
      }
    }}>
      <DialogTitle>Phiếu Cân</DialogTitle>
      <DialogContent>
        <div>
          {/* Print preview */}
          <Printable innerRef={contentRef} data={ticketData}/>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handlePrint()}>
          In
        </Button>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TicketModal;
