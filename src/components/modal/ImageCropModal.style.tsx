import { Box, styled } from '@mui/material';

export const ModalBox = styled(Box)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 0,
    bottom: '80px',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    p: 4
});
