import React, { useRef, useState } from 'react';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

type ImageCropperModalProps = {
    open: boolean;
    setOpen: (val: boolean) => void;
    base64Image: any;
    setCroppedImage: (val: any) => void;
    title: string;
    squareImage?: boolean; // set squareImage props to true only for profile pictures
    fileInputRef?: any;
};

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
    open,
    setOpen,
    base64Image,
    setCroppedImage,
    title,
    squareImage,
    fileInputRef
}) => {
    const handleClose = () => {
        setOpen(false);
        if (fileInputRef) {
            fileInputRef.current.value = '';
        }
    };

    const cropperRef = useRef<any>(null);

    const onCrop = () => {
        const cropper = cropperRef.current?.cropper;
        const canvas = cropper.getCroppedCanvas();
        setCroppedImage(canvas.toDataURL('image/png'));
    };

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== 'undefined') {
            setCroppedImage(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
        }
        handleClose();
    };

    const cancelCrop = () => {
        setCroppedImage('');
        handleClose();
    };

    return (
        <Modal className="cropimage-modal" open={open} onClose={handleClose} aria-labelledby="image-modal-title">
            <Box>
                <Typography variant="h3" mb={2}>
                    {title}
                </Typography>
                <Cropper
                    src={base64Image}
                    initialAspectRatio={squareImage ? 1 / 1 : undefined}
                    guides={false}
                    crop={onCrop}
                    ref={cropperRef}
                    cropBoxResizable={squareImage ? false : true}
                    background={false}
                    dragMode={'none'}
                />
                <Stack className="button-wrapper-row">
                    <Button variant="outlined" onClick={cancelCrop}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={getCropData}>
                        Crop
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ImageCropperModal;
