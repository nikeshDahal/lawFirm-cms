import React, { useState, useEffect } from 'react';
// material-ui
import {
    alpha,
    Button,
    Chip,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    useTheme
} from '@mui/material';

/* queries */
import FailureLoad from 'components/spinner/fail';
import useDebouncedSearch from 'hooks/common/useDebounceSearch';
import { Link, useNavigate } from 'react-router-dom';
import useSnackbar from 'hooks/common/useSnackbar';
import { EmailTemplate } from './types';
import { useGQL } from './hooks/useGQL';
import SearchIcon from '@mui/icons-material/Search';
import { PlusIcon } from 'components/icons';

import { ArrangementOrder } from 'types';
import useTable from 'hooks/common/useTable';
import { headCells } from './constants';
import { useDispatch } from 'react-redux';
import ConfirmModal from 'components/modal/ConfirmModal';
import { closeModal, openModal } from 'store/slices/modal';
import MainCard from 'ui-component/cards/MainCard';
import CustomPagination from 'components/pagination/Pagination';
import CustomLoader from 'components/loader';
import Noitems from 'components/no-items';
import { DateTime } from 'luxon';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { EmailTemplateStatus, RowPerPageOptions } from 'store/constant';
// ==============================|| CUSTOMER LIST ||============================== //

const EmailTemplateList = () => {
    const { TableContainer, EnhancedTableHead } = useTable();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { handleOpenSnackbar } = useSnackbar();
    const theme = useTheme();

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setPage(0);
            setSearchText(event?.target.value);
        }
    });

    const { GET_TEMPLATES_LIST, REMOVE_TEMPLATE, UPDATE_TEMPLATE } = useGQL();
    const { error, loading, data, refetch } = GET_TEMPLATES_LIST();
    const [handleRemoveTemplate, { data: removeTemplateData }] = REMOVE_TEMPLATE();
    const [handleUpdateTemplate, { data: UpdateEmail }] = UPDATE_TEMPLATE();
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState<string>('_id');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>('');
    const [rows, setRows] = useState<EmailTemplate[]>([]);
    const [count, setCount] = useState<number>(1);
    const [deleteEmailTemplate, setDeleteEmailTemplate] = useState('');

    const [selected, setSelected] = useState({
        id: '',
        body: '',
        subject: '',
        title: '',
        action: '',
        status: ''
    });

    const enableOrDisableStatusHelper = (status: string) => {
        return status == EmailTemplateStatus.Active ? EmailTemplateStatus.Inactive : EmailTemplateStatus.Active;
    };

    useEffect(() => {
        if (data?.getAllEmailTemplates) {
            setRows(data.getAllEmailTemplates.emailTemplates);
            setCount(data.getAllEmailTemplates?.pagination?.total!);
        }
    }, [data]);

    useEffect(() => {
        if (UpdateEmail?.updateEmailTemplate) {
            handleOpenSnackbar({ message: 'Email template updated sucessfully', alertType: 'success' });
        }
        handleRefetch();
    }, [UpdateEmail]);

    useEffect(() => {
        if (removeTemplateData?.removeEmailTemplate) {
            handleOpenSnackbar({ message: removeTemplateData.removeEmailTemplate.message, alertType: 'success' });
        }
        handleRefetch();
    }, [removeTemplateData]);

    useEffect(() => {
        const skip = page > 0 ? rowsPerPage * page : 0;
        refetch({ input: { searchText, limit: rowsPerPage, skip, order, orderBy } });
    }, [page]);

    useEffect(() => {
        handleRefetch();
    }, [orderBy, order, searchText, rowsPerPage]);

    /* handle refetch  */
    const handleRefetch = () => {
        refetch({ input: { limit: rowsPerPage, skip: searchText.length > 0 ? 0 : page * rowsPerPage, order, orderBy, searchText } });
    };

    const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage - 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const handlePageMenuItemClick = (event) => {
        handleChangeRowsPerPage(event);
    };

    const handleDelete = async (id: string) => {
        try {
            await handleRemoveTemplate({ variables: { id: deleteEmailTemplate } });
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: removeTemplateData?.removeEmailTemplate?.message!, alertType: 'error' });
        }
    };

    const handleOpenModal = (id: string, action, rowData?: any) => {
        setDeleteEmailTemplate(id);

        setSelected({
            id: rowData?._id,
            action,
            body: rowData?.body,
            subject: rowData?.subject,
            title: rowData?.title,
            status: rowData?.status
        });
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const handleUpdateStatus = async () => {
        try {
            const { id, action, status, ...others } = selected;
            await handleUpdateTemplate({
                variables: {
                    id: selected?.id,
                    input: {
                        ...others,
                        status: enableOrDisableStatusHelper(status)
                    }
                }
            });
            dispatch(closeModal());
            setSelected({
                id: '',
                body: '',
                subject: '',
                title: '',
                action: '',
                status: ''
            });
        } catch (error) {
            handleOpenSnackbar({ message: 'errr', alertType: 'error' });
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/email-template/edit/${id}`);
    };

    const handleView = (id: string) => {
        navigate(`/admin/view/${id}`);
    };

    const getChip = (status: string) => {
        // status = formStatus(status);
        if (status === EmailTemplateStatus.Active) {
            return <Chip label={status} color="success" />;
        }
        if (status === EmailTemplateStatus.Inactive) {
            return <Chip label={status} color="error" />;
        }

        return '';
    };

    return (
        <MainCard
            title={
                <Grid container justifyContent={{ md: 'space-between' }} alignItems={{ md: 'center' }} spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h2">Email template management</Typography>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Stack>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={debouncedSearch}
                                placeholder="Search template"
                                size="small"
                            />
                            {/* <Button component={Link} to="/email-template/add" variant="outlined" startIcon={<PlusIcon />}>
                                Add new
                            </Button> */}
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            <>
                <>
                    <TableContainer>
                        <>
                            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                                <EnhancedTableHead
                                    headCells={headCells}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                />
                                {!loading && (
                                    <TableBody>
                                        {rows.length != 0 && (
                                            <>
                                                {rows.map((row, index) => (
                                                    <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        {/* table cells render data */}
                                                        <TableCell>{row.title}</TableCell>
                                                        <TableCell>
                                                            {' '}
                                                            {DateTime.fromMillis(parseInt(row?.createdAt)).toFormat('dd-MM-yyyy')}
                                                        </TableCell>
                                                        <TableCell>{(row?.status && getChip(row?.status)) || '-'}</TableCell>
                                                        {/* table cells icon buttons */}
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
                                                                            <>
                                                                                <MenuItem onClick={() => handleEdit(row?._id)}>
                                                                                    Edit
                                                                                </MenuItem>

                                                                                <MenuItem
                                                                                    onClick={() =>
                                                                                        handleOpenModal(row?._id, 'StatusUpdate', row)
                                                                                    }
                                                                                >
                                                                                    {`${row?.status === EmailTemplateStatus.Active ? 'Inactive' : 'Active'}`}
                                                                                </MenuItem>
                                                                            </>
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
                            {rows.length === 0 && !loading && <Noitems />}
                        </>
                    </TableContainer>
                    {loading ? <CustomLoader /> : error ? <FailureLoad /> : null}
                    {/* table pagination */}
                    <CustomPagination
                        count={count}
                        onPageChange={handleChangePage}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onItemClick={handlePageMenuItemClick}
                        rowsPerPageOptions={RowPerPageOptions}
                    />
                </>
            </>
            {selected.action === 'StatusUpdate' && (
                <ConfirmModal
                    title={`${enableOrDisableStatusHelper(selected.status)} email template`}
                    content={`Are you sure you want to ${enableOrDisableStatusHelper(selected.status)} email template ?`}
                    yes={handleUpdateStatus}
                    buttonLabelYes="Yes"
                    buttonLabelNo="No"
                />
            )}
        </MainCard>
    );
};
export default EmailTemplateList;
