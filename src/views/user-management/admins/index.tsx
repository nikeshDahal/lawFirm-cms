import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { Button, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';

/* gql hooks */
// import useGQL from 'hooks/useGQL';
import useGQL from './hooks/useGQL';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import AdminTable from './tables';

/* variables imports */
import { Admin, AdminRoles } from './constants/types';
import { gridSpacing, RowPerPageOptions } from 'store/constant';
import useDebouncedSearch from './hooks/useDebounceSearch';
import { ArrangementOrder } from 'types';
import CustomPagination from 'components/pagination/Pagination';
import { PlusIcon, SearchIcon } from 'components/icons';
import Error from 'views/pages/maintenance/Error';
import { useSelector } from 'store';

// ==============================|| CUSTOMER LIST ||============================== //

const AdminList = () => {
    /* queries & mutations */
    const user = useSelector((state: any) => state.auth.user);

    const { GET_ALL_ADMINS } = useGQL();
    const { loading, data, refetch } = GET_ALL_ADMINS();

    /* local states */
    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('_id');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchText, setSearchText] = useState<string>('');
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [count, setCount] = useState<number>(0);

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event?.target) {
            setPage(0);
            setSearchText(event?.target.value);
        }
    });

    const handleRefetch = () => {
        refetch({ input: { limit: rowsPerPage, skip: searchText.length > 0 ? 0 : page * rowsPerPage, order, orderBy, searchText } });
    };

    useEffect(() => {
        if (data?.getAdminList) {
            setAdmins(data.getAdminList?.adminList || []);
            setCount(data.getAdminList?.pagination?.total || 0);
        }
    }, [data?.getAdminList]);

    useEffect(() => {
        const skip = page > 0 ? rowsPerPage * page : 0;
        refetch({ input: { searchText, limit: rowsPerPage, skip, order, orderBy } });
    }, [page]);

    useEffect(() => {
        handleRefetch();
    }, [orderBy, order, searchText, rowsPerPage]);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage - 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event?.target?.value) {
            setRowsPerPage(parseInt(event.target.value, 10));
        }
        setPage(0);
    };

    const handlePageMenuItemClick = (event) => {
        handleChangeRowsPerPage(event);
    };

    const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        const orderVal = isAsc ? 'desc' : 'asc';
        setOrder(orderVal);
        setOrderBy(property);
    };

    return user?.role === AdminRoles.EDITOR ? (
        <Error />
    ) : (
        <>
            <MainCard
                title={
                    <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item xs={12} md={5}>
                            <Typography variant="h2">Admin management</Typography>
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
                                {user?.role === AdminRoles.SUPER_ADMIN && (
                                    <Button variant="outlined" component={Link} to="/admin/add" color="primary" startIcon={<PlusIcon />}>
                                        Add new
                                    </Button>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                }
            >
                <AdminTable {...{ admins, handleRefetch, order, orderBy, page, rowsPerPage, handleRequestSort, loading }} />

                {/* table pagination */}
                <CustomPagination
                    count={count}
                    onPageChange={handleChangePage}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onItemClick={handlePageMenuItemClick}
                    rowsPerPageOptions={RowPerPageOptions}
                />
            </MainCard>
        </>
    );
};

export default AdminList;
