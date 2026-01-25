import React from 'react';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';

type ImagePreviewModalProps = {
    open: boolean;
    setOpen: (val: boolean) => void;
    imageUrl: string; // Signed URL instead of base64
    title: string;
};

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ open, setOpen, imageUrl, title }) => {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="image-modal-title">
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', // Centers the modal
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 2,
                    width: 'auto', // Adjust width dynamically
                    maxWidth: '90vw', // Keep it responsive
                    maxHeight: '90vh', // Prevent overflow
                    overflow: 'hidden',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h6" mb={1}>
                    {title}
                </Typography>
                <Box
                    sx={{
                        maxWidth: '100%',
                        maxHeight: '80vh', // Limit modal height
                        display: 'flex',
                        justifyContent: 'center', // Center the image horizontally
                        overflow: 'auto' // Allow scrolling if image is larger
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="Preview"
                        style={{
                            width: 'auto',
                            height: 'auto', // Let the image take its actual height
                            maxWidth: '100%', // Constrain the image width within the modal
                            maxHeight: '70vh', // Constrain the image height within the modal
                            objectFit: 'contain' // Maintain aspect ratio
                        }}
                    />
                </Box>
                <Stack direction="row" justifyContent="center" spacing={2} mt={1.5}>
                    <Button variant="outlined" onClick={handleClose}>
                        Close
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};
