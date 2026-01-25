import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    TableHead,
    TableSortLabel,
    Button,
    Stack,
    IconButton,
    alpha,
    Menu,
    MenuItem,
    TextField,
    InputAdornment
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useSnackbar from 'hooks/common/useSnackbar';
import useTable from 'hooks/common/useTable';
import { ArrangementOrder } from 'types';
import { useGQL } from './hooks/useGQL';
import { headCells } from './constants/variables';
import { dispatch } from 'store';
import MainCard from 'ui-component/cards/MainCard';
import CustomLoader from 'components/loader';
import Noitems from 'components/no-items';
import CustomPagination from 'components/pagination/Pagination';
import { RowPerPageOptions } from 'store/constant';
import { useTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import { closeModal, openModal } from 'store/slices/modal';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import SearchIcon from '@mui/icons-material/Search';
import useDebouncedSearch from 'hooks/common/useDebounceSearch';
import { PlusIcon } from 'components/icons';
import { parseColor } from 'utils/colorParser';
import FailureLoad from 'components/spinner/fail';
import ConfirmModal from 'components/modal/ConfirmModal';
import { IconAlertTriangle } from '@tabler/icons-react';
import { FeedbackBaseResponse } from './constants/types';
import { DateTime } from 'luxon';
// ==============================|| NOTIFICATION LIST ||============================== //

const FeedbackList = () => {
    const { TableContainer } = useTable();
    const theme = useTheme();
    const { handleOpenSnackbar } = useSnackbar();

    const { GET_FEEDBACK_LIST_GQL, GET_FEEDBACK_GQL, REMOVE_FEEDBACK_GQL } = useGQL();
    const { error, loading, data, refetch } = GET_FEEDBACK_LIST_GQL();
    const [handleDeleteCategory, { error: deleteCategoryErr, loading: deleteCategoryLoading, data: deleteCategory }] =
        REMOVE_FEEDBACK_GQL();

    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [rows, setRows] = useState<FeedbackBaseResponse[]>([]);
    const [count, setCount] = useState<number>(0);
    const [selected, setSelected] = useState<string[]>([]);
    const { isOpen } = useSelector((state: any) => state.modal);
    const navigate = useNavigate();
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [search, setSearch] = useState<string>('');
    const [pageMeta, setPageMeta] = useState<{ limit: number; skip: number }>({ limit: 10, skip: 0 });

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setSearch(event?.target.value);
        }
    });

    useEffect(() => {
        if (data?.findAllFeedback?.feedbacks && data?.findAllFeedback?.pagination) {
            setRows(data?.findAllFeedback?.feedbacks);
            setCount(data?.findAllFeedback?.pagination?.total);
        }
    }, [data]);

    const handleRefetch = () => {
        refetch({ input: { searchText: search, limit: pageMeta?.limit, skip: search.length > 0 ? 0 : pageMeta?.skip } });
    };

    useEffect(() => {
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setPageMeta({ limit, skip });
        refetch({ input: { searchText: search, limit, skip: search.length > 0 ? 0 : skip } });
    }, [page, rowsPerPage]);

    const handleRequestSort = (event: React.SyntheticEvent, property: string, type?: string) => {
        setOrder(type === 'asc' ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
        setPage(newPage - 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        handleRefetch();
    }, [search]);

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const handleOpenModal = (id) => {
        setSelectedTemplateId(id);
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const handleDelete = async () => {
        try {
            await handleDeleteCategory({ variables: { deleteByIdFeedbackId: selectedTemplateId! } });
            handleRefetch();
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    const EnhancedTableHead = ({ headCells, order, orderBy, onRequestSort }) => {
        const createSortHandler = (property, type) => (event) => {
            onRequestSort(event, property, type);
        };

        return (
            <TableHead>
                <TableRow>
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

    const handleView = (id: string) => {
        navigate(`/feedback/view/${id}`);
    };
    useEffect(() => {
        if (deleteCategory?.deleteByIdFeedback) {
            setSelectedTemplateId(null);
            handleOpenSnackbar({ message: deleteCategory?.deleteByIdFeedback?.message!, alertType: 'success' });
            handleRefetch();
        }
    }, [deleteCategory]);

    return (
        <MainCard
            title={
                <Grid container justifyContent={{ md: 'space-between' }} alignItems={{ md: 'center' }} spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h2">Feedback management</Typography>
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
                                placeholder="Search"
                                size="small"
                            />
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            <TableContainer>
                <>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <EnhancedTableHead headCells={headCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        {!loading && (
                            <TableBody>
                                {rows?.length != 0 && (
                                    <>
                                        {rows.map((row) => {
                                            const isItemSelected = isSelected(row._id);
                                            return (
                                                <TableRow key={row._id} selected={isItemSelected}>
                                                    <TableCell align="center">{row.user?.fullName || '-'}</TableCell>
                                                    <TableCell align="center">{row.user?.email}</TableCell>
                                                    <TableCell align="center">
                                                        {DateTime.fromJSDate(new Date(row?.createdAt)).toFormat('d-MM-yyyy')}
                                                    </TableCell>
                                                    <TableCell
                                                        align="left"
                                                        sx={{
                                                            maxWidth: 200,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {row.message}
                                                    </TableCell>

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
                                                                            onClick={() => {
                                                                                handleView(row?._id);
                                                                            }}
                                                                        >
                                                                            View
                                                                        </MenuItem>

                                                                        <MenuItem onClick={() => handleOpenModal(row?._id)}>
                                                                            Delete
                                                                        </MenuItem>
                                                                    </Menu>
                                                                </>
                                                            )}
                                                        </PopupState>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </>
                                )}
                            </TableBody>
                        )}
                    </Table>
                    {rows.length === 0 && !loading && <Noitems />}
                </>
            </TableContainer>
            {loading ? <CustomLoader /> : error ? <FailureLoad /> : null}
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
                    title={`Delete feedback`}
                    content="Are you sure you want to delete feedback ?"
                    yes={handleDelete}
                    buttonLabelYes="Yes"
                    buttonLabelNo="No"
                    size="large"
                    icon={<IconAlertTriangle />}
                />
            ) : null}
        </MainCard>
    );
};

export default FeedbackList;
