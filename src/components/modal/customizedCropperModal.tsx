import React, { useRef } from 'react';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './customModal.css';

type ImageCropperModalProps = {
    open: boolean;
    setOpen: (val: boolean) => void;
    base64Image: string;
    setCroppedImage: (base64: string, imageType: string) => void;
    title: string;
    squareImage?: boolean;
    setSelectedStepIndex: (val: any | null) => void;
    tempImage: { base64: string; imageType: string } | null;
    setTempImage: (val: { base64: string; imageType: string } | null) => void;
};

export const ImageCropperModalCustomized: React.FC<ImageCropperModalProps> = ({
    open,
    setOpen,
    base64Image,
    setCroppedImage,
    title,
    squareImage,
    setSelectedStepIndex,
    tempImage,
    setTempImage
}) => {
    const cropperRef = useRef<any>(null);

    const handleClose = () => {
        setOpen(false);
        setSelectedStepIndex(null);
        setTempImage(null);
    };

    const handleCrop = () => {
        if (cropperRef.current && cropperRef.current.cropper) {
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
            if (croppedCanvas) {
                const croppedBase64 = croppedCanvas.toDataURL(tempImage?.imageType || 'image/png');
                setCroppedImage(croppedBase64, tempImage?.imageType || 'image/png');
            }
        }
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    handleClose();
                }
            }}
            aria-labelledby="image-modal-title"
            disableAutoFocus
            disableEnforceFocus
            keepMounted
            BackdropProps={{
                style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
            }}
        >
            <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '95%',
                    maxWidth: '800px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2
                }}
            >
                <Typography variant="h5" mb={2}>
                    {title}
                </Typography>

                <Cropper
                    src={base64Image}
                    ref={cropperRef}
                    className="custom-cropper"
                    style={{ height: 500, width: '100%' }}
                    initialAspectRatio={squareImage ? 1 : undefined}
                    aspectRatio={squareImage ? 1 : undefined}
                    viewMode={1}
                    dragMode="crop"
                    guides={false}
                    background={false}
                    cropBoxMovable={true}
                    cropBoxResizable={!squareImage}
                    responsive={true}
                    zoomable={true}
                    minCropBoxHeight={100}
                    minCropBoxWidth={100}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleCrop}>
                        Crop
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};
