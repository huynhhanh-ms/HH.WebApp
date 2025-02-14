import { Box, Button, Dialog, Switch, TextField, Typography, DialogTitle, DialogActions, DialogContent } from "@mui/material";

import { SimpleChart } from "src/customs/simple-chart";
import { useScaleSetting } from "src/stores/use-scale-setting";

import { Chart } from "src/components/chart";
import { Iconify } from "src/components/iconify";

interface Props {
  open: boolean;
  onClose: () => void;
  chartData: {
    xTitle: string[];
    yData: number[][];
  }
}


export function ScaleSettingModal({ open, onClose, chartData}: Props) { 

  const { settings, setSetting } = useScaleSetting();

  // const handleChange = (event: any, setting: any) => {
  //   let newValue = parseInt(event.target.value, 10) || 0;
  //   if (newValue % 10 !== 0) newValue *= 10;
  //   setSetting(setting.key, newValue)
  // };

  // const handleWheel = (event: any, setting: any) => {
  //   event.preventDefault();
  //   const delta = event.deltaY < 0 ? 10 : -10; 
  //   setSetting(setting.key, parseInt(setting.value) + delta); 
  // };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" PaperProps={{
    }}>
      <DialogTitle variant="h4">Cài đặt Cân</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', gap: '40px' }}>
          <Box sx={{ padding: { xs: 2, md: 4 } }}>
            {
              Object.values(settings).map((setting) => (
                <div key={setting.key} className="flex justify-between pb-10 items-center">
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
                        // onChange={(e) => handleChange(e, setting)}
                        // onWheel={(e) => handleWheel(e, setting)}
                        fullWidth={false}
                        style={{ width: 100 }}
                        type="number"
                      />
                    )}
                  </div>
                </div>
              ))
            }
          </Box>

          <Box>

            <SimpleChart
              title="Chart"
              percent={-0.1}
              total={123}
              icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
              chart={{
                colors: ['#0013c0', '#ff5d5d'],
                xData: chartData.xTitle,
                yData: [
                  {
                    name: 'Hiện tại',
                    data: chartData.yData[0],
                  },
                  {
                    name: 'Cận dưới',
                    data: chartData.yData[1],
                  },
                ]
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}