import React, { useState, useEffect } from 'react';
// material-ui
import {
    Button,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Rating,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import date from 'date-and-time';
// project imports

import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import Chip from 'ui-component/extended/Chip';

/* queries */
import CustomLoader from 'components/loader';
import useTable from 'hooks/common/useTable';
import { headCells } from './constants';
import MainCard from 'ui-component/cards/MainCard';
import { PageStatusMap, PaginationSortEnum } from './constants/testimonials-management-enum';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { AdminRolesTypeEnum } from './constants/testimonials-management-enum';
import { ArrangementOrder, TestimonialCms } from './types';
import { PageStatusEnum } from './constants/testimonials-management-enum';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useDebouncedSearch from './hooks/useDebounceSearch';
import { useGQL } from './hooks/useGQL';
import { PlusIcon, SearchIcon } from 'components/icons';
import useSnackbar from './hooks/useSnackbar';
import Noitems from 'components/no-items';
import CustomPagination from 'components/pagination/Pagination';
import { RowPerPageOptions } from 'store/constant';
import { useSelector } from 'store';
import Error from 'views/pages/maintenance/Error';
import { TestimonialPath } from 'routes/PageManagementRoutes';
import ConfirmationDialog from './constants/components/ConfirmationDialog';
import stripHtml from 'utils/htmlParser';

// ==============================|| CUSTOMER LIST ||============================== //

const Testimonials = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { TableContainer, EnhancedTableHead } = useTable();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setSearch(event?.target.value);
        }
    });

    const [order, setOrder] = useState<ArrangementOrder>(PaginationSortEnum.DESC);
    const [orderBy, setOrderBy] = useState<string>('_id');
    const [search, setSearch] = useState<string>('');
    const [rows, setRows] = useState<TestimonialCms[]>([]);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const { handleOpenSnackbar } = useSnackbar();
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [count, setCount] = useState<number>(0);
    const [pageMeta, setPageMeta] = useState<{ limit: number; skip: number }>({ limit: 10, skip: 0 });

    const { GET_ADMIN_PROFILE, GET_PAGES_LIST, REMOVE_PAGE } = useGQL();
    const { loading: adminProfileLoading, data: adminProfileData } = GET_ADMIN_PROFILE();
    const { loading, data, refetch } = GET_PAGES_LIST();
    const [handleDeletePage] = REMOVE_PAGE();

    // Refetch pages if redirected from add page
    useEffect(() => {
        if (location.state?.refetch) {
            refetch();
        }
    }, [location.state]);

    useEffect(() => {
        if (data?.findAllTestimonials?.data) {
            setRows(data.findAllTestimonials.data);
            setCount(data.findAllTestimonials.pagination.total);
        }
    }, [data?.findAllTestimonials?.data]);

    const handleRefetch = () => {
        refetch({
            input: {
                searchText: search,
                limit: pageMeta?.limit,
                skip: search.length > 0 ? 0 : pageMeta?.skip,
                order,
                orderBy
            }
        });
    };
    useEffect(() => {
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setPageMeta({ limit, skip });
        refetch({
            input: { searchText: search, limit, skip: search.length > 0 ? 0 : skip, order, orderBy }
        });
    }, [page]);

    useEffect(() => {
        const limit = rowsPerPage;
        const skip = 0;
        setPageMeta({ limit, skip });
        refetch({
            input: { searchText: search, limit, skip: search.length > 0 ? 0 : skip, order, orderBy }
        });
    }, [rowsPerPage]);

    const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        handleRefetch();
    }, [orderBy, order, search]);

    const getChip = (status: string) => {
        const statusUpper = status?.toUpperCase();
        if (statusUpper === PageStatusEnum.ACTIVE) {
            return <Chip label={PageStatusMap[PageStatusEnum.ACTIVE]} color="success" />;
        } else if (statusUpper === PageStatusEnum.INACTIVE) {
            return <Chip label={PageStatusMap[PageStatusEnum.INACTIVE]} color="error" />;
        }
        return <Chip label={status || 'Unknown'} color="default" />;
    };

    const canEditOrDelete = () =>
        ![AdminRolesTypeEnum.SUPER_ADMIN, AdminRolesTypeEnum.ADMIN].includes(adminProfileData?.getUserProfile?.role);

    const handleRemovePage = async () => {
        try {
            await handleDeletePage({
                variables: { removeTestimonialId: selectedPageId }
            });
            refetch();
            handleOpenSnackbar({ message: 'Testimonial has been deleted successfully', alertType: 'success' });
            handleCloseModal();
        } catch (error) {
            handleOpenSnackbar({ message: 'Error removing testimonial', alertType: 'error' });
            handleCloseModal();
        }
    };

    const handleOpenModal = (id) => {
        setSelectedPageId(id);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const handlePageMenuItemClick = (event) => {
        handleChangeRowsPerPage(event);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        if (newPage === 0) {
            setPage(0);
        } else {
            setPage(newPage - 1);
        }
    };
    const user = useSelector((state: any) => state.auth.user);

    return user?.role === 'EDITOR' ? (
        <Error />
    ) : (
        <MainCard
            title={
                <Grid container justifyContent={{ md: 'space-between' }} alignItems={{ md: 'center' }} spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h2">Testimonial Management</Typography>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Stack>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={debouncedSearch}
                                placeholder="Search Page"
                                size="small"
                            />
                            <Button component={Link} to={`${TestimonialPath}/add`} variant="outlined" startIcon={<PlusIcon />}>
                                Add new
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            {/* table */}
            <TableContainer>
                <>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <EnhancedTableHead headCells={headCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        {!loading && (
                            <TableBody>
                                {rows.length != 0 && (
                                    <>
                                        {rows.map((row, index) => (
                                            <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell>{row?.clientName}</TableCell>
                                                <TableCell>{row?.clientDesignation}</TableCell>
                                                <TableCell>
                                                    {row?.rating ? <Rating name="read-only" value={row.rating} readOnly /> : '-'}
                                                </TableCell>
                                                <TableCell>{stripHtml(row?.message)}</TableCell>
                                                <TableCell style={{ textTransform: 'capitalize' }}>{getChip(row.status)}</TableCell>
                                                <TableCell>{date.format(new Date(row.createdAt!), 'DD-MM-YYYY')}</TableCell>
                                                <TableCell align="right">
                                                    <PopupState variant="popover" popupId="action-menu">
                                                        {(popupState) => (
                                                            <>
                                                                <IconButton className="action-button" {...bindTrigger(popupState)}>
                                                                    <MoreHorizOutlinedIcon
                                                                        fontSize="small"
                                                                        aria-controls="menu-popular-card-1"
                                                                        aria-haspopup="true"
                                                                    />
                                                                </IconButton>
                                                                <Menu {...bindMenu(popupState)}>
                                                                    <MenuItem
                                                                        disabled={canEditOrDelete()}
                                                                        onClick={() => {
                                                                            navigate(`${TestimonialPath}/edit/${row._id}`);
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        disabled={canEditOrDelete()}
                                                                        onClick={() => {
                                                                            handleOpenModal(row?._id);
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </MenuItem>
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
            {loading ? (
                <Stack alignItems={'center'}>
                    <CustomLoader />
                </Stack>
            ) : null}

            {/* table pagination */}
            <CustomPagination
                count={count}
                onPageChange={handleChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                onItemClick={handlePageMenuItemClick}
                rowsPerPageOptions={RowPerPageOptions}
            />
            {openModal ? (
                <ConfirmationDialog
                    open={openModal}
                    handleClose={handleCloseModal}
                    title={'Delete testimonial'}
                    content={'Are you sure you want to delete testimonial ?'}
                    yes={handleRemovePage}
                    buttonLabelYes={'Yes'}
                    buttonLabelNo={'No'}
                />
            ) : null}
        </MainCard>
    );
};
export default Testimonials;
