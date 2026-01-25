import { useState } from 'react';
import { IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableRow, Typography, alpha, useTheme } from '@mui/material';
import Chip from 'ui-component/extended/Chip';

import { IconAlertTriangle } from '@tabler/icons-react';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { PageActionEnum, StatusEnum, deleteAdminProps, AdminTableProps, AdminStatusEnum } from '../constants/types';

import { headCells } from '../constants/variables';
import useGQL from '../hooks/useGQL';
import useSnackbar from '../hooks/useSnackbar';
import { useDispatch, useSelector } from 'react-redux';
import { firstLetterUppercase } from 'utils/commonHelpers';
import { closeModal, openModal } from 'store/slices/modal';
import ConfirmModal from 'components/modal/ConfirmModal';
import useTable from 'hooks/common/useTable';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { useNavigate } from 'react-router-dom';
import CustomLoader from 'components/loader';
import Noitems from 'components/no-items';
import { AdminRolesMap, AdminStatusMap } from 'views/profile/constant/constant';
import { AdminStatus } from 'store/constant';
import useAuth from 'hooks/useAuth';

const AdminTable = ({ admins, handleRefetch, order, orderBy, page, rowsPerPage, handleRequestSort, loading }: AdminTableProps) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate = useNavigate();

    const { TableContainer, EnhancedTableHead } = useTable();

    const [selected, setSelected] = useState({
        id: '',
        role: '',
        status: '',
        action: ''
    });

    const { DELETE_ADMIN, UPDATE_ADMIN_STATUS } = useGQL();
    const { handleOpenSnackbar } = useSnackbar();

    const [handleAdminDelete] = DELETE_ADMIN();
    const [handleAdminStatus] = UPDATE_ADMIN_STATUS();

    function canEditOrDelete(currentUserRole, targetUserRole) {
        // Super Admin can edit anyone
        if (currentUserRole === 'SUPERADMIN') return true;

        // Admin can edit Editors but not other Admins or Super Admins
        return currentUserRole === 'ADMIN' && targetUserRole === 'EDITOR';
    }

    const enableOrDisableStatusHelper = (status: string) => {
        return status == StatusEnum.ACTIVE ? PageActionEnum.DISABLE : PageActionEnum.ENABLE;
    };

    const currentEnableOrDisableStatusHelper = (status: string) => {
        return status == StatusEnum.ACTIVE ? PageActionEnum.DISABLE : PageActionEnum.ENABLE;
    };

    const userDetails = useSelector((state: any) => state.auth.user);

    const handleOpenModal = (admin: deleteAdminProps, action?: string) => {
        setSelected({
            id: admin._id,
            role: admin.role,
            status: admin.status,
            action: action || ''
        });
        dispatch(
            openModal({
                isOpen: false
            })
        );
    };

    const handleView = (id: string) => {
        navigate(`/admin/view/${id}`);
    };

    const handleEdit = (id: string) => {
        navigate(`/admin/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            const data = await handleAdminDelete({ variables: { id: selected.id } });
            handleOpenSnackbar({
                message: data?.data?.removeAdmin?.message,
                alertType: 'success'
            });
            handleRefetch();
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    const handleStatus = async () => {
        try {
            await handleAdminStatus({
                variables: {
                    input: {
                        id: selected.id,
                        status: selected.status === StatusEnum.ACTIVE ? StatusEnum.PENDING : StatusEnum.ACTIVE
                    }
                }
            });
            handleRefetch();
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    return (
        <>
            <TableContainer>
                <>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <EnhancedTableHead headCells={headCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        {!loading && (
                            <TableBody>
                                {admins.length != 0 && (
                                    <>
                                        {admins.map((admin, index) => (
                                            <TableRow key={admin._id}>
                                                <TableCell>{admin.firstName === null ? '' : admin.firstName}</TableCell>
                                                <TableCell>{admin.lastName === null ? '' : admin.lastName}</TableCell>
                                                <TableCell>{admin.email}</TableCell>
                                                <TableCell>{AdminRolesMap[admin.role]}</TableCell>
                                                <TableCell>
                                                    {admin.status === AdminStatus.ACTIVE && (
                                                        <Chip label={AdminStatusMap[admin.status]} size="medium" color="success" />
                                                    )}
                                                    {admin.status === AdminStatus.PENDING && (
                                                        <Chip label={AdminStatusMap[admin.status]} size="medium" color="error" />
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <PopupState variant="popover" popupId="action-menu">
                                                        {(popupState) => (
                                                            <>
                                                                <IconButton
                                                                    className="action-button"
                                                                    size="large"
                                                                    {...bindTrigger(popupState)}
                                                                    sx={{
                                                                        border: `1px solid ${theme.palette.primary.main}`,
                                                                        color: theme.palette.primary.main,
                                                                        '&:hover': {
                                                                            borderColor: alpha(theme.palette.primary.main, 0.32),
                                                                            bgcolor: alpha(theme.palette.primary.main, 0.32),
                                                                            '.MuiSvgIcon-root': {
                                                                                color: 'background.paper'
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    <MoreHorizOutlinedIcon
                                                                        fontSize="small"
                                                                        aria-controls="menu-popular-card-1"
                                                                        aria-haspopup="true"
                                                                    />
                                                                </IconButton>
                                                                <Menu
                                                                    {...bindMenu(popupState)}
                                                                    anchorOrigin={{
                                                                        vertical: 'bottom',
                                                                        horizontal: 'right'
                                                                    }}
                                                                    transformOrigin={{
                                                                        vertical: 'top',
                                                                        horizontal: 'right'
                                                                    }}
                                                                >
                                                                    <MenuItem onClick={() => handleView(admin._id)}>View</MenuItem>
                                                                    {canEditOrDelete(userDetails?.role, admin?.role) && (
                                                                        <>
                                                                            <MenuItem onClick={() => handleEdit(admin._id)}>Edit</MenuItem>
                                                                            <MenuItem
                                                                                onClick={() => {
                                                                                    handleOpenModal(admin, PageActionEnum.ENABLE);
                                                                                }}
                                                                            >
                                                                                {enableOrDisableStatusHelper(admin.status)}
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                onClick={() =>
                                                                                    handleOpenModal(admin, PageActionEnum.DELETE)
                                                                                }
                                                                            >
                                                                                Delete
                                                                            </MenuItem>
                                                                        </>
                                                                    )}
                                                                </Menu>
                                                            </>
                                                        )}
                                                    </PopupState>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        )}
                    </Table>
                    {admins.length === 0 && !loading && <Noitems />}
                </>
            </TableContainer>
            {loading && <CustomLoader />}
            {selected?.action === PageActionEnum.DELETE ? (
                <ConfirmModal
                    title={`Are you sure you want to delete ${AdminRolesMap[selected.role]?.toLowerCase()}`}
                    content={`This will remove ${AdminRolesMap[selected.role]?.toLowerCase()} from the system.`}
                    yes={handleDelete}
                    buttonLabelYes="Delete user"
                    buttonLabelNo="Cancel and keep user"
                    size="large"
                    icon={<IconAlertTriangle color={theme.palette.orange.dark} />}
                />
            ) : (
                <ConfirmModal
                    title={`Are you sure you want to make ${AdminRolesMap[selected.role]?.toLowerCase()} ${enableOrDisableStatusHelper(selected.status)?.toLowerCase()}`}
                    content={`This will ${enableOrDisableStatusHelper(selected.status)?.toLowerCase()}  ${AdminRolesMap[selected.role]?.toLowerCase()} status from the system.`}
                    yes={handleStatus}
                    buttonLabelYes={`Make team member ${enableOrDisableStatusHelper(selected.status)?.toLowerCase()}`}
                    buttonLabelNo={`Cancel and keep team member ${AdminStatusMap[selected?.status]?.toLowerCase()}`}
                    size="large"
                    icon={<IconAlertTriangle color={theme.palette.orange.dark} />}
                />
            )}
        </>
    );
};

export default AdminTable;
