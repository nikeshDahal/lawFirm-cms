import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '@mui/material';
import { closeModal } from 'store/slices/modal';

const GenericModal = ({ children }) => {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state: any) => state.modal);

    const handleClose = () => {
        dispatch(closeModal());
    };

    return (
        <Modal open={isOpen} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
            <div>{children}</div>
        </Modal>
    );
};

export default GenericModal;
