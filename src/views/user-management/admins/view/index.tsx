import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
// material-ui
import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';

// project imports
import UserProfile from './AdminProfile';
import Security from './Security';
import TabPanel from 'components/tabpanel/TabPanel';
import MainCard from 'ui-component/cards/MainCard';

// assets
import { gridSpacing } from 'store/constant';
import useGQL from '../hooks/useGQL';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// tabs option
const tabsOption = [
    {
        label: 'User profile',
        icon: <PersonOutlineTwoToneIcon />
    },
    {
        label: 'Password settings',
        icon: <VpnKeyTwoToneIcon />
    }
];

// ==============================|| Admin Profile ||============================== //

const AdminProfile = () => {
    const { id: adminId } = useParams();
    const locationUrl = useLocation();
    const isView = locationUrl.pathname.includes('/admin/view');
    const [value, setValue] = React.useState<number>(0);

    const filteredTabsOption = isView ? tabsOption.filter((tab) => tab.label !== 'Password Settings') : tabsOption;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { GET_ADMIN } = useGQL();
    const { error, loading, data, refetch } = GET_ADMIN(adminId!);
    const breadcrumbLinks = [
        { title: 'Admin management', to: '/admin/list' },
        {
            title: adminId
                ? `${isView ? 'view' : 'Edit'}  ${loading ? '' : data?.getAdmin?.admin?.firstName + ' ' + data?.getAdmin?.admin?.lastName}`
                : 'Add new admin'
        }
    ];

    return (
        <>
            <Stack className="custom-breadcrumb">
                <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
            </Stack>
            <MainCard title="Admin user profile" className="user-setting">
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} lg={2.78} display={'flex'}>
                        <Tabs className="profile-tab" value={value} onChange={handleChange} orientation="vertical" variant="scrollable">
                            {filteredTabsOption.map((tab, index) => (
                                <Tab
                                    key={index}
                                    icon={tab.icon}
                                    label={
                                        <Grid container direction="column">
                                            <Typography variant="subtitle1" color="inherit">
                                                {tab.label}
                                            </Typography>
                                        </Grid>
                                    }
                                    {...a11yProps(index)}
                                />
                            ))}
                        </Tabs>
                    </Grid>
                    <Grid item xs={12} lg={8.55}>
                        <Box>
                            <TabPanel value={value} index={0}>
                                <UserProfile
                                    adminId={adminId!}
                                    isView={isView}
                                    data={data}
                                    loading={loading}
                                    refetch={refetch}
                                    error={error}
                                />
                            </TabPanel>
                            {!isView && (
                                <TabPanel value={value} index={1}>
                                    <Security adminId={adminId!} data={data} loading={loading} error={error} />
                                </TabPanel>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default AdminProfile;
