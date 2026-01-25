import React, { MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type AlertDialogProps = {
    title: string;
    description: string;
    handleMutation: any;
    handleAlertDialogClose: () => void;
    open: boolean;
};
export default function AlertDialog({ title, description, open, handleMutation, handleAlertDialogClose }: AlertDialogProps) {
    const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
        const dataId = event.currentTarget.getAttribute('data-id');
        if (dataId === 'yes') {
            handleMutation();
        }
        handleAlertDialogClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="primary" data-id="no">
                    No
                </Button>
                <Button onClick={handleClose} variant="contained" color="primary" data-id="yes" autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}
