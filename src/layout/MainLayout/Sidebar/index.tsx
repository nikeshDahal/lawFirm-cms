import { memo, useMemo } from 'react';

// material-ui
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// types
import { MenuOrientation, ThemeMode } from 'types/config';

import { Avatar } from '@mui/material';
import { IconMenu2 } from '@tabler/icons-react';

import logoDark from 'assets/images/logo-only.png';
import logoWhite from 'assets/images/icons/white-myComms.svg';
import Logo from 'ui-component/Logo';
// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
    const theme = useTheme();
    const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;

    const { mode, menuOrientation, miniDrawer } = useConfig();

    const logo = useMemo(
        () => (
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: '15px 18px' }}>
                {/* <img style={{ width: 80, height: 50 }} src={logoDark}></img> */}
                <Logo height="50" width="80" />
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        overflow: 'hidden',
                        transition: 'all .2s ease-in-out',
                        bgcolor: 'transparent',
                        color: mode === ThemeMode.DARK ? 'primary.main' : 'background.paper',
                        p: 0.75,
                        mr: !drawerOpen ? 1.25 : '-4px',
                        mt: '-4px',
                        width: '40px',
                        height: '40px',
                        '&:hover': {
                            bgcolor: 'transparent',
                            color: mode === ThemeMode.DARK ? 'primary.light' : 'secondary.light'
                        },
                        svg: {
                            width: 28,
                            height: 28
                        }
                    }}
                    onClick={() => handlerDrawerOpen(!drawerOpen)}
                    color="inherit"
                >
                    <IconMenu2 stroke={1.5} size="20px" />
                </Avatar>
            </Stack>
        ),
        []
    );

    const drawer = useMemo(() => {
        let drawerSX = { paddingLeft: '0px', paddingRight: '0px', marginTop: '20px' };
        if (drawerOpen) drawerSX = { paddingLeft: '6px', paddingRight: '6px', marginTop: '0px' };

        return (
            <>
                {downMD ? (
                    <Box sx={drawerSX}>
                        <MenuList />
                    </Box>
                ) : (
                    <PerfectScrollbar style={{ height: 'calc(100vh - 61px)', ...drawerSX }}>
                        <MenuList />
                    </PerfectScrollbar>
                )}
            </>
        );
    }, [downMD, drawerOpen, menuOrientation]);

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }} aria-label="mailbox folders">
            {downMD || (miniDrawer && drawerOpen) ? (
                <Drawer
                    variant={downMD ? 'temporary' : 'persistent'}
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => handlerDrawerOpen(!drawerOpen)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            mt: downMD ? 0 : 11,
                            zIndex: 1099,
                            width: drawerWidth,
                            color: 'text.primary',
                            borderRight: 'none',
                            backgroundColor: mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.primary.main
                        }
                    }}
                    ModalProps={{ keepMounted: true }}
                    color="inherit"
                >
                    {downMD && logo}
                    {drawer}
                </Drawer>
            ) : (
                <MiniDrawerStyled variant="permanent" open={drawerOpen}>
                    {logo}
                    {drawer}
                </MiniDrawerStyled>
            )}
        </Box>
    );
};

export default memo(Sidebar);
