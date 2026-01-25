// third-party
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type order = 'asc' | 'desc';

type SortType = {
    order: order;
    orderBy: string;
};

type TableType = {
    searchText: string;
    page: number;
    rowsPerPage: number;
    sort: SortType;
};

const initialState: TableType = {
    searchText: '',
    page: 0,
    rowsPerPage: 5,
    sort: {
        order: 'desc',
        orderBy: '_id'
    }
};
const slice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setSearchText(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        setRowsPerPage(state, action: PayloadAction<number>) {
            state.rowsPerPage = action.payload;
        },
        setSort(state, action: PayloadAction<SortType>) {
            state.sort = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
export const { setSearchText, setPage, setRowsPerPage, setSort } = slice.actions;
