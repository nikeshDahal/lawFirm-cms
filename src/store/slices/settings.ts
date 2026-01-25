// third-party
import { createSlice } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

const initialStateForSettings = {
    settings: []
};
const slice = createSlice({
    name: 'settings',
    initialState: initialStateForSettings,
    reducers: {
        setSettings(state, action) {
            const { settings } = action.payload;
            state.settings = settings;
        }
    }
});

const persistedReducer = persistReducer(
    {
        key: 'settings',
        storage: storage
    },
    slice.reducer
);

// Reducer
// export default slice.reducer;
export default persistedReducer;

// ----------------------------------------------------------------------
export const { setSettings } = slice.actions;
