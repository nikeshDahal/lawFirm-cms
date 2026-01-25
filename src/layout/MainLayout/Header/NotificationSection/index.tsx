import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconBell } from '@tabler/icons-react';

// types
import { ThemeMode } from 'types/config';
import { Badge } from '@mui/material';
import { NotificationList } from './NotificationList';
import { dispatch } from 'store';
import { updateAdminNotification } from 'store/slices/adminNotification';
import { useSelector } from 'react-redux';
import useSnackbar from 'hooks/common/useSnackbar';
import { useMutation } from '@apollo/client';
import { NotificationTemplateResponse } from 'views/NotificationManagement/constants/types';
import { MARK_ALL_SEEN_NOTIFICATION, MARK_AS_SEEN_NOTIFICATION } from 'views/NotificationManagement/graphql';
import { useGQL } from 'views/NotificationManagement/hooks/useGQL';

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState<NotificationTemplateResponse[]>([]);
    const [unreadCount1, setUnreadCount1] = useState<number>(0);
    const [notificationId, setNotificationId] = useState<string | null>(null);

    /* API */
    const { GET_NOTIFICATIONS } = useGQL();
    const { handleOpenSnackbar } = useSnackbar();
    const [loadNotification] = GET_NOTIFICATIONS();

    const { notifications: notificationData, message, unreadCount, pagination } = useSelector((state: any) => state?.adminNotification);

    useEffect(() => {
        loadNotification({
            variables: {
                input: {
                    limit: 4,
                    skip: 0
                }
            }
        }).then(({ data: notificationData1 }) => {
            if (notificationData1?.listAdminNotifications) {
                dispatch(
                    updateAdminNotification({
                        notifications: notificationData1?.listAdminNotifications.notifications,
                        message: notificationData1?.listAdminNotifications.message,
                        pagination: notificationData1?.listAdminNotifications.pagination!,
                        unreadCount: notificationData1?.listAdminNotifications.unreadCount
                    })
                );
            }
        });
    }, []);

    useEffect(() => {
        if (notificationData) {
            setRows(notificationData);
        }

        setUnreadCount1(unreadCount);
    }, [notificationData, unreadCount]);

    const anchorRef = useRef<any>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    // /* read clicked mark all read */
    const [markAllRead, {}] = useMutation(MARK_ALL_SEEN_NOTIFICATION, {
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {}
    });

    const [markAsRead, {}] = useMutation(MARK_AS_SEEN_NOTIFICATION, {
        variables: {
            notificationId
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
            setNotificationId(null);
        }
    });

    const handleAllRead = async () => {
        try {
            await markAllRead();
            loadNotification({
                variables: {
                    input: {
                        limit: 4,
                        skip: 0
                    }
                }
            }).then(({ data: notificationData1 }) => {
                if (notificationData1?.listAdminNotifications) {
                    dispatch(
                        updateAdminNotification({
                            notifications: notificationData1.listAdminNotifications.notifications,
                            message: notificationData1.listAdminNotifications.message,
                            pagination: notificationData1.listAdminNotifications.pagination!,
                            unreadCount: notificationData1.listAdminNotifications.unreadCount
                        })
                    );
                }
            });
            setOpen(false);
        } catch (error) {
            handleOpenSnackbar({ message: 'Error in notification', alertType: 'error' });
        }
    };

    const markAsReadHandler = async (id: string) => {
        try {
            await markAsRead();
            loadNotification({
                variables: {
                    input: {
                        limit: 4,
                        skip: 0
                    }
                }
            }).then(({ data: notificationData1 }) => {
                if (notificationData1?.listAdminNotifications) {
                    dispatch(
                        updateAdminNotification({
                            notifications: notificationData1.listAdminNotifications.notifications,
                            message: notificationData1.listAdminNotifications.message,
                            pagination: notificationData1.listAdminNotifications.pagination!,
                            unreadCount: notificationData1.listAdminNotifications.unreadCount
                        })
                    );
                }
            });
        } catch (error) {
            handleOpenSnackbar({ message: 'Error in notification', alertType: 'error' });
        }
    };

    return (
        <div>
            <Box sx={{ ml: 2 }}>
                <Badge
                    badgeContent={unreadCount1 >= 10 ? '9+' : unreadCount1}
                    color="error"
                    sx={{
                        position: 'absolute',
                        marginLeft: '2.5rem',
                        marginBottom: '0.5rem'
                    }}
                ></Badge>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        transition: 'all .2s ease-in-out',
                        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.main',
                        color: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'background.paper',
                        '&[aria-controls="menu-list-grow"],&:hover': {
                            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'primary.light',
                            color: theme.palette.mode === ThemeMode.DARK ? 'grey.800' : 'background.paper'
                        }
                    }}
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    color="inherit"
                >
                    <IconBell stroke={1.5} size="20px" />
                </Avatar>
            </Box>

            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                            <Paper sx={{ borderRadius: '12px', width: '350px' }}>
                                {open && (
                                    <MainCard border={false} elevation={12} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item xs={12}>
                                                <Grid
                                                    container
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    sx={{ pt: 3, pb: 0.75, px: 2 }}
                                                >
                                                    <Grid item sx={{ width: '100%' }}>
                                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                            <Typography variant="h4" fontWeight={500}>
                                                                All Notification
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label={unreadCount1 > 99 ? `99+` : unreadCount1}
                                                                sx={{
                                                                    color: '#ffffff!important',
                                                                    bgcolor: '#FFC107'
                                                                }}
                                                            />
                                                        </Stack>
                                                    </Grid>

                                                    <Grid item>
                                                        <Button
                                                            sx={{
                                                                cursor: 'pointer',
                                                                fontWeight: '600',
                                                                mt: '0.5rem'
                                                            }}
                                                            size="small"
                                                            variant="text"
                                                            onClick={() => handleAllRead()}
                                                            disabled={!rows?.length || !unreadCount1}
                                                        >
                                                            Mark as all read
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Divider
                                                sx={{
                                                    mt: '1rem',
                                                    borderBottomWidth: '0.15rem' // Increases thickness
                                                }}
                                            />

                                            <Grid item xs={12}>
                                                <PerfectScrollbar
                                                    style={{
                                                        height: '100%',
                                                        maxHeight: 'calc(100vh - 205px)',
                                                        overflowX: 'hidden'
                                                    }}
                                                >
                                                    <NotificationList
                                                        notifications={rows}
                                                        onClose={(e) => handleClose(e)}
                                                        onRead={(val) => setNotificationId(val)}
                                                        markAsReadHandler={markAsReadHandler}
                                                    />
                                                </PerfectScrollbar>
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                        <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                                            <Button
                                                component={Link}
                                                to="/notification-list"
                                                size="small"
                                                color="inherit"
                                                sx={{
                                                    color: '#000ca4',
                                                    fontWeight: 'normal',
                                                    marginBottom: '4px'
                                                }}
                                                onClick={() => {
                                                    setOpen(false);
                                                }}
                                                disableElevation
                                            >
                                                View All
                                            </Button>
                                        </CardActions>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </div>
    );
};

export default NotificationSection;
