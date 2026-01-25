// third-party
import { createSlice, current } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type InitValues = {
    loading: boolean;
    errors: boolean;
    values: {}[];
    linkedValues: {}[];
};
const defaultValue: InitValues = {
    loading: true,
    errors: false,
    values: [],
    linkedValues: []
};

const getValues = (values, payload) => {
    const currentValue = values.filter((value) => value[payload.type] !== undefined);
    if (currentValue.length > 0) {
        return [...values, { [payload.type]: { ...currentValue[0][payload.type], ...values } }];
    }

    return [...values, { [payload.type]: payload.values }];
};

const slice = createSlice({
    name: 'page',
    initialState: defaultValue,
    reducers: {
        setValues: (state, action: { payload: { type: string; values: {} } }) => {
            state.values = [...state.values, { data: action.payload.values, key: action.payload.type }];
        },
        setLinkedValues: (state, action: { payload: { type: string; values: {} } }) => {
            state.linkedValues = [...state.linkedValues, { data: action.payload.values, key: action.payload.type }];
        },
        setErrors: (state, action: { payload: boolean }) => {
            /* if error, reset payload */
            if (action.payload) {
                state.values = [];
            }
            state.errors = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        resetForm: (state) => {
            state.loading = true;
            state.errors = false;
            state.values = [];
            state.linkedValues = [];
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
export const { setValues, setLinkedValues, setLoading, setErrors, resetForm } = slice.actions;
