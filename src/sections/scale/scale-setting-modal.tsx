import { Box, Button, Dialog, Switch, TextField, Typography, DialogTitle, DialogActions, DialogContent } from "@mui/material";

import { useScaleSetting } from "src/stores/use-scale-setting";

import { Iconify } from "src/components/iconify";

interface Props {
  open: boolean;
  onClose: () => void;
}


export function ScaleSettingModal({ open, onClose }: Props) {

  const { settings, setSetting } = useScaleSetting();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{
    }}>
      <DialogTitle variant="h4">Cài đặt Cân</DialogTitle>
      <DialogContent>

        {
          Object.values(settings).map((setting) => (
            <div key={setting.key} className="flex justify-between pt-10 items-center">
              <Iconify icon={setting.icon} marginRight={2} />
              <Typography variant="h6" color="inherit" className="flex-grow">
                {setting.label}
              </Typography>
              <div>
                {setting.type === 'boolean' ? (
                  <Switch
                    checked={setting.value as boolean}
                    onChange={(e) => setSetting(setting.key, e.target.checked)}
                  />
                ) : (
                  <TextField
                    value={setting.value}
                    onChange={(e) => setSetting(setting.key, e.target.value)}
                    fullWidth={false}
                    style={{ width: 100 }}
                    type="number"
                  />
                )}
              </div>
            </div>
          ))
        }

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}