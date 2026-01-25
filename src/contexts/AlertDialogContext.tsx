import React, { createContext, useState } from 'react';

type DialogConfig = {
    title: string;
    message: string;
    actionCallback: (res: boolean) => void;
};

type DialogState = {
    open: boolean;
    dialogConfig: DialogConfig;
};

type DialogContextType = {
    dialog: DialogState;
    openDialog: (config: DialogConfig) => void;
    resetDialog: () => void;
};

type PropTypes = {
    children: React.ReactElement;
};

const initialState: DialogState = {
    open: false,
    dialogConfig: {
        title: '',
        message: '',
        actionCallback: (res: boolean) => {}
    }
};

export const DialogContext = createContext<DialogContextType | null>(null);

const AlertDialogProvider = ({ children }: PropTypes) => {
    const [dialog, setDialog] = useState<DialogState>(initialState);

    const openDialog = (config: DialogConfig) => {
        setDialog({ open: true, dialogConfig: { ...config } });
    };

    const resetDialog = () => {
        setDialog(initialState);
    };

    return <DialogContext.Provider value={{ dialog, openDialog, resetDialog }}>{children}</DialogContext.Provider>;
};

export default AlertDialogProvider;
