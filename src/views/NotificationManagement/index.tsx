import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Checkbox,
    TableHead,
    TableSortLabel,
    Button,
    Stack,
    useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useSnackbar from 'hooks/common/useSnackbar';
import useTable from 'hooks/common/useTable';
import { ArrangementOrder } from 'types';
import { useGQL } from './hooks/useGQL';
import { headCells } from './constants/variables';
import { updateAdminNotification } from 'store/slices/adminNotification';
import { dispatch } from 'store';
import MainCard from 'ui-component/cards/MainCard';
import CustomLoader from 'components/loader';
import Noitems from 'components/no-items';
import CustomPagination from 'components/pagination/Pagination';
import { RowPerPageOptions } from 'store/constant';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { formatNotificationTime } from 'utils/time-formatter';
import { NotificationTemplateResponse, NotificationType } from './constants/types';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmModal from 'components/modal/ConfirmModal';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { closeModal, openModal } from 'store/slices/modal';
// ==============================|| NOTIFICATION LIST ||============================== //

const NotificationList = () => {
    const { TableContainer } = useTable();
    const navigate = useNavigate();
    const theme = useTheme();
    const { handleOpenSnackbar } = useSnackbar();

    const { GET_NOTIFICATIONS_ADMIN, MARK_AS_SEEN, DELETE_NOTIFICATIONS, GET_NOTIFICATIONS } = useGQL();
    const [loadNotification] = GET_NOTIFICATIONS();
    const { error, loading, data, refetch } = GET_NOTIFICATIONS_ADMIN();
    const [
        handleDeleteNotificationData,
        { error: deleteNotificationError, loading: deleteNotificationLoading, data: deletedNotification }
    ] = DELETE_NOTIFICATIONS();

    const [handleMarkAsRead, { loading: notificationLoading, data: notificationData }] = MARK_AS_SEEN();

    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [rows, setRows] = useState<NotificationTemplateResponse[]>([]);
    const [count, setCount] = useState<number>(0);
    const [selected, setSelected] = useState<string[]>([]);
    const { isOpen } = useSelector((state: any) => state.modal);

    useEffect(() => {
        if (data?.listAdminNotifications?.notifications && data?.listAdminNotifications?.pagination) {
            setRows(data?.listAdminNotifications?.notifications!);
            setCount(data?.listAdminNotifications?.pagination?.total);
        }
    }, [data]);

    const { notifications, message, unreadCount, pagination } = useSelector((state: any) => state?.adminNotification);

    useEffect(() => {
        if (notifications) {
            refetch({ input: { limit: rowsPerPage, skip: page * rowsPerPage } });
        }
    }, [notifications]);

    useEffect(() => {
        refetch({ input: { limit: rowsPerPage, skip: page * rowsPerPage } });
    }, [page, rowsPerPage]);

    const handleView = async (userId: string, notificationId: string, theme: any) => {
        try {
            await handleMarkAsRead({ variables: { notificationId } });

            await loadNotification({
                variables: { input: { limit: 4, skip: 0 } }
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
            if (theme === NotificationType.SUCCESSFUL_USER_DELETED) {
                const limit = rowsPerPage;
                const skip = page > 0 ? limit * page : 0;
                refetch({ input: { limit, skip: skip } });
                return;
            }
            navigate(`/app-user/profile/${userId}`, { replace: true });
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    const handleRequestSort = (event: React.SyntheticEvent, property: string, type?: string) => {
        setOrder(type === 'asc' ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((row) => row._id);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else {
            newSelected = selected.filter((selectedId) => selectedId !== id);
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
        setPage(newPage - 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const handleDelete = async () => {
        try {
            const { data: deletedNotificationData } = await handleDeleteNotificationData({ variables: { ids: selected } });
            await loadNotification({
                variables: { input: { limit: 4, skip: 0 } }
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
                    handleOpenSnackbar({ message: deletedNotificationData?.deleteNotifications?.message!, alertType: 'success' });
                }
            });
            const limit = rowsPerPage;
            const skip = page > 0 ? limit * page : 0;
            refetch({ input: { limit, skip: skip } });
            setSelected([]);
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    const handleOpenModal = () => {
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const EnhancedTableHead = ({ headCells, order, orderBy, onRequestSort, selected, onSelectAllClick }) => {
        const createSortHandler = (property, type) => (event) => {
            onRequestSort(event, property, type);
        };

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            sx={{ color: theme.palette.primary.main }}
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < rows.length}
                            checked={rows.length > 0 && selected.length === rows.length}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {headCells.map((headCell) => (
                        <TableCell key={headCell.id} align={headCell.align} sortDirection={orderBy === headCell.id ? order : false}>
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id, headCell.type)}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    };

    return (
        <MainCard
            title={
                <Grid container justifyContent={{ md: 'space-between' }} alignItems={{ md: 'center' }} spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h2">Notification management</Typography>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Stack>
                            <Button
                                disabled={selected.length === 0}
                                onClick={handleOpenModal}
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                            >
                                Delete notification
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        headCells={headCells}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        selected={selected}
                        onSelectAllClick={handleSelectAllClick}
                    />

                    <TableBody>
                        {loading ? (
                            <CustomLoader />
                        ) : rows.length > 0 ? (
                            rows.map((row) => {
                                const isItemSelected = isSelected(row._id);
                                return (
                                    <TableRow
                                        key={row._id}
                                        selected={isItemSelected}
                                        sx={{
                                            background: row.isOpen ? 'white' : '#d9e3ff',
                                            '&.Mui-selected': {
                                                // Override MUI's default selected styling
                                                backgroundColor: '#a9c1fc !important' // Ensures custom selected color
                                            }
                                        }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                onChange={(event) => handleCheckboxClick(event, row._id)}
                                                sx={{ color: theme.palette.primary.main }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.background.paper }}>
                                                <NotificationsNoneIcon sx={{ color: theme.palette.primary.main }} />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell
                                            onClick={() => {
                                                handleView(row?.userId, row?._id, row?.theme);
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                            align="center"
                                        >
                                            {row.description}
                                        </TableCell>
                                        <TableCell align="center">{formatNotificationTime(new Date(row.createdAt))}</TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <Noitems />
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomPagination
                count={count}
                onPageChange={handleChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                onItemClick={handleChangeRowsPerPage}
                rowsPerPageOptions={RowPerPageOptions}
            />

            {isOpen ? (
                <ConfirmModal
                    title={`Delete notification`}
                    content="Are you sure you want to delete notification ?"
                    yes={handleDelete}
                    buttonLabelYes="Yes"
                    buttonLabelNo="No"
                    size="large"
                    icon={<IconAlertTriangle color={theme.palette.orange.dark} />}
                />
            ) : null}
        </MainCard>
    );
};

export default NotificationList;
