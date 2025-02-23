import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Trang quản lý dữ liệu và thống kê của hệ thống Công ty TNHH TM DV Huynh Hạnh"
        />
        <meta name="keywords" content="Quản lý, Huynh Hạnh, Thống kê" />
      </Helmet>

      <OverviewAnalyticsView />
    </>
  );
}
