import type { Tank } from 'src/domains/dto/tank';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { fDate, fDateTime, formatStr } from 'src/utils/format-time';

import { TankApi } from 'src/services/api/tank.api';
import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { ApiQueryKey } from 'src/services/api-query-key';
import { SessionApi } from 'src/services/api/session.api';

import { AnalyticsTankVolume } from 'src/sections/tank/analytics-tank-volume';

import { AnalyticsNews } from '../analytics-news';
import { MinimalWidget } from '../minimal-widget';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {

  const [gasoline, setGasoline] = useState<Tank>();
  const [diesel, setDiesel] = useState<Tank>();
  const { data: tankResponse, isSuccess } = useQuery({
    queryKey: [ApiQueryKey.tank],
    queryFn: TankApi.gets,
  });
  useEffect(() => {
    if (isSuccess) {
      setGasoline(tankResponse[0]);
      setDiesel(tankResponse[1]);
    }
  }, [isSuccess, tankResponse, gasoline?.currentVolume, gasoline?.capacity]);

  // Fetch Session data
  const { data: sessionData } = useQuery({
    queryKey: [ApiQueryKey.session],
    queryFn: SessionApi.gets,
  });

  // this month
  const [totalRevenueThisMonth, setTotalRevenueThisMonth] = useState<number>(0);
  useEffect(() => {
    // session of this month
    const sessionNow = sessionData?.filter(session => new Date(session.startDate).getMonth() === new Date().getMonth());
    const totalRevenue = sessionNow?.reduce((totalAccumulated, currentSession) => {
      const sessionRevenue = currentSession?.petrolPumps?.reduce((pumpTotal, pump) => pumpTotal + (pump?.revenue ?? 0), 0) ?? 0;
      return totalAccumulated + sessionRevenue;
    }, 0);

    setTotalRevenueThisMonth(totalRevenue ?? 0);
  }, [sessionData]);

  // last month
  const [totalRevenueLastMonth, setTotalRevenueLastMonth] = useState<number>(0);
  useEffect(() => {
    // session of last month
    const sessionLast = sessionData?.filter(session => new Date(session.startDate).getMonth() === new Date().getMonth() - 1);

    const totalRevenue = sessionLast?.reduce((totalAccumulated, currentSession) => {
      const sessionRevenue = currentSession?.petrolPumps?.reduce((pumpTotal, pump) => pumpTotal + (pump?.revenue ?? 0), 0) ?? 0;
      return totalAccumulated + sessionRevenue;
    }, 0);

    setTotalRevenueLastMonth(totalRevenue ?? 0);
  }, [sessionData]);


  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Chào chủ nhân 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3} >
          {gasoline &&
            <AnalyticsTankVolume
              title={gasoline.name}
              percent={Math.ceil(gasoline.currentVolume / gasoline.capacity * 100)}
              // percent={14.2} 
              total={gasoline.currentVolume}
              color='success'
              icon={<img alt="icon" src="/assets/icons/tank/xang.svg" />}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [22, 8, 35, 50, 82, 84, 77, 12],
              }}
            />
          }
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          {diesel &&
            <AnalyticsTankVolume
              title={diesel.name}
              percent={diesel.currentVolume / diesel.capacity * 100}
              total={diesel.currentVolume}
              color='warning'
              icon={<img alt="icon" src="/assets/icons/tank/dau.svg" />}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [22, 8, 35, 50, 82, 84, 77, 12],
              }}
            />}
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <MinimalWidget
            title={`Doanh số ${fDate(new Date(), 'MM/YYYY')}`}
            percent={0}
            total={ totalRevenueThisMonth}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-money.svg" />}
            chart={{
              categories: sessionData?.sort((pre, nxt) => new Date(pre.startDate).getTime() - new Date(nxt.startDate).getTime()).map(session => fDateTime(session.startDate, formatStr.split.date) ?? '') ?? [],
              // series: [22, 8, 35, 50, 82, 84, 77, 12],
              series: sessionData?.map(session => session?.petrolPumps?.reduce((pre, cur) => pre + cur.revenue, 0) ?? 0) ?? [],
            }}
          />
          <div className='p-1'/>
          <MinimalWidget
            title={`Doanh số ${fDate(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'MM/YYYY')}`}
            percent={0}
            total={ totalRevenueLastMonth}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-money.svg" />}
            chart={{
              categories: sessionData?.sort((pre, nxt) => new Date(pre.startDate).getTime() - new Date(nxt.startDate).getTime()).map(session => fDateTime(session.startDate, formatStr.split.date) ?? '') ?? [],
              // series: [22, 8, 35, 50, 82, 84, 77, 12],
              series: sessionData?.map(session => session?.petrolPumps?.reduce((pre, cur) => pre + cur.revenue, 0) ?? 0) ?? [],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Chưa biết viết gì em ơi"
            percent={-0.1}
            total={NaN}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

{/* 
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Doanh số "
            subheader="(+43%) than last year"
            chart={{
              colors: ['#00a116', '#ffc628'],
              categories: sessionData?.sort((pre, nxt) => new Date(pre.startDate).getTime() - new Date(nxt.startDate).getTime()).map(session => fDateTime(session.startDate, formatStr.minialDate) ?? '') ?? [],
              series: [
                { name: 'Xăng', data: 
                  sessionData?.map(session => session?.petrolPumps?.[0].revenue) ?? [],
                },
                { name: 'Dầu', data: 
                  // [43, 33, 22, 37, 67, 68, 37, 24, 55] 
                  sessionData?.map(session => session?.petrolPumps?.[1].revenue) ?? [],
                },
              ],
            }}
          />
        </Grid>
{/* 
        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}
      </Grid>

{/* 
      <div className='h-[2000px]'>-----------</div>

      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Weekly sales"
            percent={2.6}
            total={714000}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="New users"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Purchase orders"
            percent={2.8}
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Messages"
            percent={3.6}
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid>
      </Grid> */}
    </DashboardContent>
  );
}
