// third-party
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import { LoginState } from 'types';

type RegisterState = {
    isRegister: boolean;
};

type AuthState = LoginState & RegisterState;

const initialState: AuthState = {
    isLoggedIn: false,
    isRegister: false,
    user: null,
    isBrowserVerified: false
};
const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginState(state, action: PayloadAction<LoginState>) {
            const { isLoggedIn, accessToken, refreshToken, user, isBrowserVerified, otpExpiresAt } = action.payload;
            state.isLoggedIn = isLoggedIn;
            state.isRegister = true;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.user = user;
            state.isBrowserVerified = isBrowserVerified;
            state.otpExpiresAt = otpExpiresAt;
        },
        setRegisterState(state, action: PayloadAction<RegisterState>) {
            const { isRegister } = action.payload;
            state.isRegister = isRegister;
        }
    }
});

const persistedReducer = persistReducer(
    {
        key: 'auth',
        storage: storage
    },
    slice.reducer
);

// Reducer
// export default slice.reducer;
export default persistedReducer;

// ----------------------------------------------------------------------
export const { setLoginState, setRegisterState } = slice.actions;
