import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ScaleSettingModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{
      sx: {
        minHeight: 600,
      }
    }}>
      <DialogTitle>Phiếu Cân</DialogTitle>
      <DialogContent>
        123
      </DialogContent>
      <DialogActions>
        <Button onClick={() => console.log('in')}>
          In
        </Button>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}