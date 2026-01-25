// third-party
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { NotificationTemplateResponse, Pagination } from 'views/NotificationManagement/constants/types';

export type NotificationResponseType = {
    notifications?: NotificationTemplateResponse | null;
    message: string;
    pagination: Pagination | null;
    unreadCount: number;
};

const defaultValue: NotificationResponseType = {
    notifications: null,
    message: '',
    pagination: null,
    unreadCount: 0
};

// const defaultValue: NotificationResponse = {
//     notifications: null,
//     message: '',
//     pagination: null,
//     unreadCount: 0
// };
const slice = createSlice({
    name: 'adminNotification',
    initialState: defaultValue,
    reducers: {
        updateAdminNotification(state, action: PayloadAction<NotificationResponseType>) {
            const { notifications, unreadCount, pagination, message } = action.payload;

            state.notifications = notifications;
            state.unreadCount = unreadCount;
            state.pagination = pagination;
            state.message = message;
        },
        resetAdminNotification(state) {
            state.notifications = null;
            state.unreadCount = 0;
            state.message = '';
            state.pagination = null;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
export const { updateAdminNotification, resetAdminNotification } = slice.actions;
