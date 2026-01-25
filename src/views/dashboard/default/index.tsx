import { Grid, Stack, useTheme } from '@mui/material';
import PageTitle from 'components/page-title/PageTitle';
import { useEffect, useState } from 'react';
import EarningCard from './EarningCard';
import TotalIncomeLightCard from '../components/TotalIncomeLightCard2';

import { PeopleIcon, ScissorIcon } from 'components/icons';
import { serviceProviderColumns } from '../constant';
import { useSelector } from 'store';
import Error from 'views/pages/maintenance/Error';
// import useGQL from '../hooks/useGQL';
import PaymentsIcon from '@mui/icons-material/Payments';
import { SubscriptionIcon } from 'components/icons';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const theme = useTheme();
    const [count, setCount] = useState<number>(0);
    // const { GET_USERS, GET_SUBSCRIPTION_STATS } = useGQL();
    // const { error, loading, data, refetch } = GET_USERS();
    // const { data: subStats, loading: subStatsLoading } = GET_SUBSCRIPTION_STATS();

    // useEffect(() => {
    //     if (data?.getAllAppUsers?.users && data?.getAllAppUsers?.pagination) {
    //         setRows(data.getAllAppUsers.users);
    //         setCount(data.getAllAppUsers.pagination.total);
    //     }
    // }, [data]);

    // useEffect(() => {
    //     if (subStats?.getSubscriptionStatistics?.data) {
    //         setStats(subStats?.getSubscriptionStatistics?.data);
    //     }
    // }, [subStats]);

    const user = useSelector((state: any) => state.auth.user);

    return user?.role === 'EDITOR' ? (
        <Error />
    ) : (
        <>
            {/* element={<Element />} */}
            <PageTitle title="Dashboard" />
            <>
                {`Last login: ${new Date()}`}
                {/* <Grid container spacing={3}>
                    <Grid item md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={{ xs: 2, lg: 3 }}>
                                    <Grid item xs={12} sm={7.3} md={12} lg={7.3}>
                                        <EarningCard isLoading={loading} totalUsers={count} />
                                    </Grid>
                                    <Grid item xs={12} sm={4.7} md={12} lg={4.7}>
                                        <Stack spacing={1.5}>
                                            <TotalIncomeLightCard
                                                {...{
                                                    isLoading: loading,
                                                    total: stats?.totalSubscribedUser || 0,
                                                    label: 'Total Subscriptions',
                                                    icon: <SubscriptionIcon />,
                                                    mainBgColor: theme.palette.primary.main,
                                                    textColor: theme.palette.background.paper,
                                                    isMoney: false
                                                }}
                                            />
                                            <TotalIncomeLightCard
                                                {...{
                                                    isLoading: loading,
                                                    total: stats?.totalAmountCollected || 0,
                                                    label: 'Total Income',
                                                    icon: <SubscriptionIcon color="#000CA4" />,
                                                    mainBgColor: theme.palette.common.white,
                                                    textColor: 'black',
                                                    isMoney: true
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <DashboardCard
                                    title="New users"
                                    total={count}
                                    rows={rows}
                                    columns={serviceProviderColumns}
                                    linkTo="/app-user/list"
                                    loading={loading}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid> */}
            </>
        </>
    );
};

export default Dashboard;
