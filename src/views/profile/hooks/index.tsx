import * as React from 'react';

export const useAlertDialog = () => {
    const [alertDialog, setAlertDialog] = React.useState(false);

    const handleAlertDialogOpen = () => {
        setAlertDialog(true);
    };

    const handleAlertDialogClose = () => {
        setAlertDialog(false);
    };
    return { alertDialog, handleAlertDialogOpen, handleAlertDialogClose };
};
