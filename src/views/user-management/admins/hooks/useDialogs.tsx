import { useState } from 'react';

const useDialog = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    return { openDialog, handleDialogClose, handleDialogOpen };
};

const useAlertDialog = () => {
    const [alertDialog, setAlertDialog] = useState(false);

    const handleAlertDialogOpen = () => {
        setAlertDialog(true);
    };

    const handleAlertDialogClose = () => {
        setAlertDialog(false);
    };
    return { alertDialog, handleAlertDialogOpen, handleAlertDialogClose };
};

export { useDialog, useAlertDialog };
