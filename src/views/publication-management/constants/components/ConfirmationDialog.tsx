import { Box, Button, IconButton, Modal, Stack, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import ClearIcon from '@mui/icons-material/Clear';
import { ModalBox, StickyFooter, StickyHeader } from './confirmModal.style';
import { ConfirmModalProps } from '../types';

const ConfirmModal1 = ({
    open,
    handleClose,
    title,
    content,
    yes,
    no,
    buttonLabelYes,
    buttonLabelNo,
    loader,
    size,
    icon
}: ConfirmModalProps) => {
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="confirm-modal-title" aria-describedby="confirm-modal-description">
            <ModalBox bgcolor={'background.paper'} sx={{ maxWidth: size === 'large' ? '830px' : '620px', width: '100%' }}>
                <StickyHeader>
                    <Stack direction="row" spacing={2.5}>
                        {icon && <Box>{icon}</Box>}
                        <Typography id="confirm-modal-title" variant="h3" component="h2">
                            {title}
                        </Typography>
                    </Stack>
                    <IconButton onClick={handleClose}>
                        <ClearIcon />
                    </IconButton>
                </StickyHeader>
                <Typography id="confirm-modal-description" sx={{ mt: 2 }}>
                    {content}
                </Typography>
                {loader && (
                    <Stack alignItems={'center'}>
                        <CircularProgress />
                    </Stack>
                )}
                {size === 'large' ? (
                    <StickyFooter sx={{ flexDirection: 'column' }}>
                        {buttonLabelNo && (
                            <Button variant="contained" color="primary" onClick={handleClose}>
                                {buttonLabelNo}
                            </Button>
                        )}
                        <Button variant="outlined" color="primary" onClick={yes}>
                            {buttonLabelYes}
                        </Button>
                    </StickyFooter>
                ) : (
                    <StickyFooter>
                        {buttonLabelNo && (
                            <Button variant="contained" color="primary" onClick={handleClose}>
                                {buttonLabelNo}
                            </Button>
                        )}
                        <Button variant="outlined" color="primary" onClick={yes}>
                            {buttonLabelYes}
                        </Button>
                    </StickyFooter>
                )}
            </ModalBox>
        </Modal>
    );
};

export default ConfirmModal1;
