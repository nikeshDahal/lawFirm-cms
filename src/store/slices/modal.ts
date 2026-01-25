// slices/modalSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { GenericModalProps } from 'types/modal';

const initialState: GenericModalProps = {
    isOpen: false,
    modalProps: {}
};
export const modal = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true;
            state.modalProps = action.payload;
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.modalProps = {};
        }
    }
});

export const { openModal, closeModal } = modal.actions;

export default modal.reducer;
