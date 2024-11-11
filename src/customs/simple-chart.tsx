import type { BoxProps } from '@mui/material/Box';
import type { ColorType } from 'src/theme/core/palette';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  title: string;
  total: number;
  percent: number;
  color?: ColorType;
  icon: React.ReactNode;
  chart: {
    colors?: string[];
    yData: {
      name: string;
      data: number[];
    }[];
    xData: string[];
    options?: ChartOptions;
  };
};

export function SimpleChart({
  chart,
  color = 'primary',
  sx,
  ...other
}: Props) {

  const theme = useTheme();

  const chartColors = [theme.palette[color].dark];

  const chartOptions = useChart({
    // chart: { sparkline: { enabled: true } },
    colors: chart.colors ?? chartColors,
    xaxis: { categories: chart.xData },
    yaxis: {
      labels: {
        formatter(value) {
          return `${fShortenNumber(value)}`;
        }
      },
    },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        // title: { formatter: () => '' } 
      },
    },
    ...chart.options,
  });


  // // State để quản lý dữ liệu của series
  // const [seriesData, setSeriesData] = useState(chart.yData);

  // // Hàm cập nhật series
  // const updateChartData = () => {
  //   const newData = Array.from({ length: seriesData.length }, () => getRandomNumber());
  //   setSeriesData(newData);

  //   // Nếu chartRef đã khởi tạo, gọi updateSeries
  //   if (chartRef.current) {
  //     chartRef.current.updateSeries([{ data: newData }]);
  //   }
  // };

  // // Hàm tạo số ngẫu nhiên
  // const getRandomNumber = () => Math.floor(Math.random() * 100);

  // // Gọi updateChartData mỗi khi cần cập nhật dữ liệu
  // useEffect(() => {
  //   const interval = setInterval(updateChartData, 2000); // Cập nhật mỗi 2 giây
  //   return () => clearInterval(interval); // Dọn dẹp interval khi unmount
  // }, []);

  return (
    <Box {...other}
    >
      <Chart
        type="line"
        series={chart.yData}
        options={chartOptions}
        width={800}
        height={500}
      />
    </Box>
  );
}
