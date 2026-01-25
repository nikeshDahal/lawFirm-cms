import { DialogContext } from 'contexts/AlertDialogContext';
import { useContext } from 'react';

const useAlertDialogContext = () => {
    const context = useContext(DialogContext);
    if (!context) throw new Error('Invalid context');
    return context;
};

export default useAlertDialogContext;
