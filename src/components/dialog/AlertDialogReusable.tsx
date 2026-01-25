import React, { MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useAlertDialog from 'hooks/common/useAlertDialog';
import useAlertDialogContext from 'hooks/common/useAlertDialogContext';

export default function AlertDialog() {
    const {
        dialog: { open, dialogConfig }
    } = useAlertDialogContext();
    const { onConfirm, onClose } = useAlertDialog();
    const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
        const dataId = event.currentTarget.getAttribute('data-id');
        if (dataId === 'yes') {
            onConfirm();
        }
        onClose();
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{dialogConfig.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{dialogConfig.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="text" color="error" data-id="no">
                        No
                    </Button>
                    <Button onClick={handleClose} variant="text" color="success" data-id="yes" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
