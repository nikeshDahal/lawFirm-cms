import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';

type SnackbarParams = {
    message: string;
    alertType: string;
    timeout?: number;
};

const useSnackbar = () => {
    const dispatch = useDispatch();
    const handleOpenSnackbar = ({ message, alertType, timeout }: SnackbarParams) => {
        dispatch(
            openSnackbar({
                open: true,
                message: message || 'fallback message',
                anchorOrigin: { vertical:'bottom', horizontal: 'center' },
                variant: 'alert',
                alert: {
                    color: alertType
                },
                timeout
            })
        );
    };

    return { handleOpenSnackbar };
};

export default useSnackbar;
