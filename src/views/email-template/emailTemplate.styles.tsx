import { Dialog, styled } from '@mui/material';

export const EmailTemplatePreviewDialog = styled(Dialog)(({ theme }) => ({
    '.MuiPaper-root': {
        boxShadow: '0 0 0 3px rgba(255,255,255,0.5)',
        padding: theme.spacing(3), // Adds consistent padding around the dialog content
        borderRadius: theme.shape.borderRadius // Ensures rounded corners (optional)
    }
}));
