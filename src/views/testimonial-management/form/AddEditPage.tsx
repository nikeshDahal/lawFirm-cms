import { useEffect, useRef, useState } from 'react';
import slugify from 'slugify';
import { Formik, FormikProps } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, TextField, FormHelperText, Stack, Button, MenuItem, Paper, IconButton, Divider, Rating } from '@mui/material';
import InputLabel from 'ui-component/extended/Form/InputLabel';

import { PageManagementListPath } from '../constants';
import { PageStatus } from '../constants/variables';
import { useGQL } from '../hooks/useGQL';
import useSnackbar from '../hooks/useSnackbar';
import { TestimonialPath } from 'routes/PageManagementRoutes';
import DeleteIcon from '@mui/icons-material/Delete';
import { UPLOAD_IMAGE_MAX_SIZE_MB, uploadImage } from 'utils/imageUploader';
import { useApolloClient } from '@apollo/client';
import QuillEditor from 'utils/QuillEditor';
import ConfirmationDialog from '../constants/components/ConfirmationDialog';
import { PageStatusEnum } from '../constants/testimonials-management-enum';
import { testimonialValidationSchema } from '../validations';

const AddEditTestimonialPage = () => {
    const client = useApolloClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState({
        message: '',
        rating: 0,
        clientName: '',
        clientDesignation: '',
        clientImage: '' as string | File,
        status: ''
    });

    const { handleOpenSnackbar } = useSnackbar();

    const formRef = useRef<FormikProps<typeof initialValues>>(null);

    const { CREATE_PAGE, UPDATE_PAGE, GET_PAGE } = useGQL();
    const [handleCreatePage, { data }] = CREATE_PAGE();
    const { data: pageData, loading: pagaDataLoading } = GET_PAGE(id!);
    const [handleUpdatePage] = UPDATE_PAGE();
    const breadcrumbLinks = [
        { title: 'Testimonial Management', to: `${TestimonialPath}/list` },
        { title: id ? `Edit ${pagaDataLoading ? '' : pageData?.findTestimonialById?.page?.clientName}` : 'Add new testimonial' }
    ];

    useEffect(() => {
        if (pageData?.findTestimonialById?.page) {
            setInitialValues({
                ...pageData?.findTestimonialById?.page,
                status: pageData?.findTestimonialById?.page.status?.toUpperCase() ?? 'INACTIVE'
            });
        }
    }, [pageData]);

    const handleSubmitExternally = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
        handleCloseModal();
    };

    const handleFormSubmit = async (values, setSubmitting) => {
        try {
            setSubmitting(true);
            let payload = { ...values };

            /** IMAGE UPLOAD */
            if (values.clientImage instanceof File) {
                const file = values.clientImage;
                const { fileKey, publicUrl } = await uploadImage(client, file, {
                    maxSizeMB: UPLOAD_IMAGE_MAX_SIZE_MB
                });

                payload.clientImage = publicUrl; // or fileKey depending on backend
            }

            /** CREATE vs UPDATE */
            if (id) {
                const { _id, createdAt, updatedAt, ...others } = payload;
                await handleUpdatePage({
                    variables: {
                        body: {
                            ...others,
                            id: id!
                        }
                    }
                });

                handleOpenSnackbar({ message: 'Testimonial updated successfully', alertType: 'success' });
            } else {
                const { ...formattedPayload } = payload;
                await handleCreatePage({
                    variables: {
                        body: formattedPayload
                    }
                });

                handleOpenSnackbar({ message: 'Testimonial created successfully', alertType: 'success' });
            }

            navigate(`${TestimonialPath}/list`, { state: { refetch: true } });
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            <Stack className="custom-breadcrumb">
                <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
            </Stack>
            <Formik
                innerRef={id ? formRef : null}
                enableReinitialize
                initialValues={initialValues}
                validationSchema={testimonialValidationSchema}
                onSubmit={(values, { setSubmitting, setFieldValue }) => {
                    handleFormSubmit(values, setSubmitting);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    validateForm,
                    isSubmitting,
                    setFieldTouched
                    /* and other goodies */
                }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <MainCard title={id ? `Edit testimonial` : 'Add new testimonial'} sx={{ position: 'relative' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} mt={1}>
                                        <strong>Client information</strong>
                                        <Divider sx={{ mb: 2, mt: 1 }} />
                                    </Grid>
                                    <Grid container item spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Client name *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="clientName"
                                                placeholder="Enter client name"
                                                value={values.clientName}
                                                name="clientName"
                                                onBlur={handleBlur}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                }}
                                            />
                                            {touched.clientName && errors.clientName && (
                                                <FormHelperText error id="clientName-error">
                                                    {errors.clientName}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Client designation *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="clientDesignation"
                                                placeholder="Enter client designation"
                                                value={values.clientDesignation}
                                                name="clientDesignation"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {touched.clientDesignation && errors.clientDesignation && (
                                                <FormHelperText error id="clientDesignation-error">
                                                    {errors.clientDesignation}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Status *</InputLabel>
                                            <TextField
                                                id="page-status"
                                                name="status"
                                                select
                                                value={values.status}
                                                fullWidth
                                                onChange={handleChange}
                                            >
                                                {PageStatus.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            {touched.status && errors.status && (
                                                <FormHelperText error id="status-error">
                                                    {errors.status}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <InputLabel id="rating-label">Rating *</InputLabel>
                                            <Rating
                                                name="rating"
                                                value={values.rating}
                                                onChange={(event, newValue) => {
                                                    setFieldValue('rating', newValue); // Formik setter
                                                }}
                                                onBlur={handleBlur}
                                                precision={1} // whole stars only
                                            />
                                            {touched.rating && errors.rating && (
                                                <FormHelperText error id="rating-error">
                                                    {errors.rating}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Client image *</InputLabel>

                                            {/* Image Upload Container */}
                                            <div
                                                onClick={() => document.getElementById('clientImageInput')?.click()}
                                                style={{
                                                    width: '100%',
                                                    height: '300px',
                                                    border: '2px dashed #11382C',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    backgroundColor: '#f9f9f9'
                                                }}
                                            >
                                                {/* Placeholder Text */}
                                                {values.clientImage === '' && (
                                                    <span style={{ color: '#aaa' }}>Upload client image here</span>
                                                )}

                                                {/* Image Preview */}
                                                {values.clientImage && (
                                                    <div
                                                        style={{
                                                            position: 'relative',
                                                            width: '100%',
                                                            height: '100%',
                                                            padding: '10px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                values.clientImage instanceof File
                                                                    ? URL.createObjectURL(values.clientImage)
                                                                    : values.clientImage
                                                            }
                                                            alt="Preview"
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'contain',
                                                                borderRadius: 4
                                                            }}
                                                        />

                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFieldValue('clientImage', '');
                                                            }}
                                                            style={{
                                                                position: 'absolute',
                                                                top: 5,
                                                                right: 5,
                                                                backgroundColor: 'rgba(255,255,255,0.7)',
                                                                color: 'red'
                                                            }}
                                                            size="small"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                )}

                                                {/* Hidden File Input */}
                                                <input
                                                    id="clientImageInput"
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0];
                                                        if (!file) return;
                                                        setFieldValue('clientImage', file);
                                                        setFieldTouched('clientImage', false);
                                                    }}
                                                    onBlur={() => setFieldTouched('clientImage', true)}
                                                />
                                            </div>

                                            {touched.clientImage && errors.clientImage && (
                                                <FormHelperText error id="clientImage-error">
                                                    {errors.clientImage}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </Grid>

                                    {/* =================== Content Section =================== */}
                                    <Grid container item spacing={2}>
                                        <Grid item xs={12} mt={1}>
                                            <strong>Client message</strong>
                                            <Divider sx={{ mb: 2, mt: 1 }} />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <InputLabel>Content *</InputLabel>
                                            <QuillEditor value={values.message} setFieldValue={setFieldValue} fieldName="message" />
                                            {touched.message && errors.message && (
                                                <FormHelperText error id="message-error">
                                                    {errors.message}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </MainCard>
                            <Grid item xs={12} mt={2}>
                                <Paper sx={{ p: 2 }}>
                                    <Stack className="button-wrapper-row">
                                        {id ? (
                                            <Button
                                                disabled={isSubmitting}
                                                onClick={async () => {
                                                    const formErrors = await validateForm();
                                                    if (!Object.keys(formErrors).length) {
                                                        handleOpenModal();
                                                    } else {
                                                        handleSubmit();
                                                    }
                                                }}
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                            >
                                                Save changes
                                            </Button>
                                        ) : (
                                            <Button type="submit" variant="contained" color="primary" size="large">
                                                Save
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => {
                                                navigate(PageManagementListPath);
                                            }}
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </form>
                    );
                }}
            </Formik>
            {openModal ? (
                <ConfirmationDialog
                    open={openModal}
                    handleClose={handleCloseModal}
                    title={'Update page details'}
                    content={'Are you sure you want to update page details ?'}
                    yes={handleSubmitExternally}
                    buttonLabelYes={'Yes'}
                    buttonLabelNo={'No'}
                />
            ) : null}
        </>
    );
};

export default AddEditTestimonialPage;
