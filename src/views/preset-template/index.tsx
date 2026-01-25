// material-ui
import {
    alpha,
    Button,
    Grid,
    IconButton,
    InputAdornment,
    ListSubheader,
    Menu,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

/* queries */
import { Link, useNavigate } from 'react-router-dom';

import { PlusIcon } from 'components/icons';

import MainCard from 'ui-component/cards/MainCard';
import useDebouncedSearch from 'hooks/common/useDebounceSearch';
import SearchIcon from '@mui/icons-material/Search';
import useTable from 'hooks/common/useTable';
import React, { useEffect, useState } from 'react';
import { ArrangementOrder } from 'types';
import { FilterTemplateType, PresetTemplate, TemplateTypeEnum } from './constants/types';
import Noitems from 'components/no-items';
import { useGQL } from './hooks/useGQL';
import { getChip } from './utils';
import CustomLoader from 'components/loader';
import FailureLoad from 'components/spinner/fail';
import CustomPagination from 'components/pagination/Pagination';
import { RowPerPageOptions } from 'store/constant';
import { DateTime } from 'luxon';
import { FilterMenuList, headCellsForTask } from './constants/variables';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import ConfirmModal from 'components/modal/ConfirmModal';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from 'store/slices/modal';
import { IconAlertTriangle } from '@tabler/icons-react';
import useSnackbar from 'hooks/common/useSnackbar';
import { TaskTemplateAdd, TaskTemplateEdit } from 'constants/routePaths';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckIcon from '@mui/icons-material/Check';
import { useCategories } from 'hooks/useCategories';
import { Category } from 'store/slices/category';

// ==============================|| CUSTOMER LIST ||============================== //

const PresetList = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { handleOpenSnackbar } = useSnackbar();
    const { TableContainer, EnhancedTableHead } = useTable();
    const { categories } = useCategories();
    const { isOpen } = useSelector((state: any) => state.modal);
    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setPage(0);
            setSearchText(event?.target.value);
        }
    });

    const { GET_TEMPLATES_LIST, REMOVE_TASK } = useGQL();
    const { error, loading, data, refetch } = GET_TEMPLATES_LIST();

    const [handleDeleteTask, { error: deleteTaskErr, loading: deleteTaskLoading, data: deleteTask }] = REMOVE_TASK();

    const [templateType, setTemplateType] = useState(TemplateTypeEnum.Task);
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>('');
    const [rows, setRows] = useState<PresetTemplate[]>([]);
    const [count, setCount] = useState<number>(1);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCategoryId, setselectedCategoryId] = useState<any>([]);
    const [selectedSort, setSelectedSort] = useState('all');
    const [filterData, setFilterData] = useState<FilterTemplateType[]>(FilterMenuList);

    /** useEffects handlings */

    useEffect(() => {
        if (data?.getAllTaskTemplate) {
            setRows(data.getAllTaskTemplate.tasks!);
            setCount(data.getAllTaskTemplate?.pagination?.total!);
        }
    }, [data]);

    useEffect(() => {
        const skip = page > 0 ? rowsPerPage * page : 0;
        refetch({ input: { searchText, limit: rowsPerPage, skip, order, orderBy, templateType, categoryIds: selectedCategoryId } });
    }, [page]);

    useEffect(() => {
        handleRefetch();
    }, [orderBy, order, searchText, rowsPerPage, templateType, selectedCategory]);

    useEffect(() => {
        if (categories) {
            const categoryFilters = categories.map((cat: Category) => ({
                label: cat.categoryName,
                value: cat.categoryName,
                section: 'category',
                _id: cat._id
            }));

            // Add the "All" category statically
            const allCategory = {
                label: 'All',
                value: 'all',
                section: 'category',
                _id: 'static-all'
            };

            const updatedFilterData = [allCategory, ...filterData.filter((item) => item.section !== 'category'), ...categoryFilters];

            setFilterData(updatedFilterData);
        }
    }, [categories]);

    useEffect(() => {
        if (templateType === TemplateTypeEnum.Task) {
            if (deleteTask?.deleteTaskTemplate) {
                handleOpenSnackbar({ message: deleteTask?.deleteTaskTemplate?.message, alertType: 'success' });
                handleRefetch();
            }
        }
    }, [deleteTask, selectedCategoryId]);
    /** refetch handlngs */
    const handleRefetch = () => {
        refetch({
            input: {
                limit: rowsPerPage,
                skip: searchText.length > 0 ? 0 : page * rowsPerPage,
                order,
                orderBy,
                searchText,
                templateType,
                categoryIds: selectedCategoryId
            }
        });
    };

    /** sort handlings */
    const handleRequestSort = (event: React.SyntheticEvent<Element, Event> | null, property: string, type?: string) => {
        setOrder(type === 'asc' ? 'asc' : 'desc');
        setOrderBy(property);
    };

    /** pagination handlings */

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

    /** handler functions for action */

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectOption = (option) => {
        if (option.section === 'category') {
            setSelectedCategory(option?.value);
            if (option?.value === 'all') {
                setselectedCategoryId([]);
            } else {
                setselectedCategoryId(option?._id);
            }
        } else if (option.section === 'downloads') {
            setSelectedSort(option.value);
            handleRequestSort(null, 'downloads', option?.value);
        }
        handleClose();
    };
    const handleEdit = (id: string) => {
        navigate(`${TaskTemplateEdit}/${id}`);
    };

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
            await handleDeleteTask({ variables: { input: { id: selectedTemplateId! } } });
            handleRefetch();
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    return (
        <MainCard
            title={
                <Grid container justifyContent={{ md: 'space-between' }} alignItems={{ md: 'center' }} spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h2">Task templates</Typography>
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
                            <>
                                <Button
                                    id="sort-customized-button"
                                    aria-controls={open ? 'sort-customized-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    variant="outlined"
                                    disableElevation
                                    onClick={handleClick}
                                    startIcon={<FilterListIcon />}
                                    sx={{ fontSize: '1rem', p: '2px 16px' }}
                                >
                                    Filter
                                </Button>
                                <Menu
                                    id="sort-customized-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'sort-button'
                                    }}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center'
                                    }}
                                    open={open}
                                    onClose={handleClose}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            width: '250px', // Adjust width as per design
                                            padding: '2px',
                                            borderRadius: '8px'
                                        }
                                    }}
                                >
                                    {/* Section: Filter by */}
                                    <ListSubheader sx={{ color: 'black', fontSize: '0.9rem', fontWeight: 'bold' }}>Category</ListSubheader>
                                    {filterData
                                        .filter((item) => item.section === 'category')
                                        .map((filterOption, index) => (
                                            <MenuItem
                                                key={index}
                                                onClick={() => {
                                                    handleSelectOption(filterOption);
                                                }}
                                                disableRipple
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {filterOption.label}
                                                {selectedCategory === filterOption.value && (
                                                    <CheckIcon sx={{ fontSize: '0.9rem', color: 'blue' }} />
                                                )}
                                            </MenuItem>
                                        ))}

                                    {/* Section: Date joined */}
                                    <ListSubheader sx={{ color: 'black', fontSize: '0.9rem', fontWeight: 'bold' }}>Downloads</ListSubheader>
                                    {filterData
                                        .filter((item) => item.section === 'downloads')
                                        .map((filterOption, index) => (
                                            <MenuItem
                                                key={index}
                                                onClick={() => handleSelectOption(filterOption)}
                                                disableRipple
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {filterOption.label}
                                                {selectedSort === filterOption?.value && (
                                                    <CheckIcon sx={{ fontSize: '1rem', color: 'blue' }} />
                                                )}
                                            </MenuItem>
                                        ))}
                                </Menu>
                            </>
                            <Button component={Link} to={TaskTemplateAdd} variant="outlined" startIcon={<PlusIcon />}>
                                Add new
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ marginBottom: '1rem', marginTop: '1rem' }}>
                <Button
                    variant={templateType === TemplateTypeEnum.Task ? 'contained' : 'outlined'}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '12px',
                        padding: '12px 24px'
                    }}
                    onClick={() => setTemplateType(TemplateTypeEnum.Task)}
                >
                    Task
                </Button>
            </Stack>

            <>
                <>
                    <TableContainer>
                        <>
                            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                                <EnhancedTableHead
                                    headCells={headCellsForTask}
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
                                                        <TableCell> {row.taskName}</TableCell>
                                                        <TableCell>
                                                            {row?.taskCategory?.map(
                                                                (category, index) =>
                                                                    `${category?.categoryName}${index !== row.taskCategory.length - 1 ? ' | ' : ''}`
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{row?.taskStepCount}</TableCell>
                                                        <TableCell>{row?.downloads}</TableCell>
                                                        <TableCell>
                                                            {DateTime.fromJSDate(new Date(row?.createdAt!)).toFormat('dd-MM-yyyy')}
                                                        </TableCell>
                                                        <TableCell>{(row?.status && getChip(row?.status)) || '-'}</TableCell>
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

                                                                                <MenuItem onClick={() => handleOpenModal(row?._id)}>
                                                                                    Delete
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
            {isOpen ? (
                <ConfirmModal
                    title={`Delete task template`}
                    content="Are you sure you want to delete this task template ?"
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
export default PresetList;
