import { useEffect, useRef, useState } from 'react';
import slugify from 'slugify';
import { Formik, FormikProps } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, TextField, FormHelperText, Stack, Button, MenuItem, Paper, IconButton } from '@mui/material';
import InputLabel from 'ui-component/extended/Form/InputLabel';

import { PageManagementListPath } from '../constants';
import { PageStatus, PageTypeMapp, PageTypes } from '../constants/variables';
import { pageValidationSchema } from '../validations';
import { useGQL } from '../hooks/useGQL';
import ConfirmationDialog from '../components/ConfirmationDialog';
import useSnackbar from '../hooks/useSnackbar';
// import QuillEditor from '../components/QuillEditor';
import { PracticeAreaPath } from 'routes/PageManagementRoutes';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadImage } from 'utils/imageUploader';
import { useApolloClient } from '@apollo/client';
import QuillEditor from 'utils/QuillEditor';

const AddEditPagePracticeArea = () => {
    const client = useApolloClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState({
        pageType: '',
        title: '',
        slug: '',
        status: '',
        content: '',
        metaData: '',
        pageImage: '' as string | File,
        seoTags: {
            title: '',
            tags: '',
            description: ''
        }
    });

    const { handleOpenSnackbar } = useSnackbar();

    const formRef = useRef<FormikProps<typeof initialValues>>(null);

    const { CREATE_PAGE, UPDATE_PAGE, GET_PAGE } = useGQL();
    const [handleCreatePage, { data }] = CREATE_PAGE();
    const { data: pageData, loading: pagaDataLoading } = GET_PAGE(id!);
    const [handleUpdatePage] = UPDATE_PAGE();
    console.log('pageData', pageData);
    const breadcrumbLinks = [
        { title: 'Practice Area Management', to: `${PracticeAreaPath}/list` },
        { title: id ? `Edit ${pagaDataLoading ? '' : pageData?.findPracticeAreaById?.page?.title}` : 'Add new practice area' }
    ];

    useEffect(() => {
        if (pageData?.findPracticeAreaById?.page) {
            setInitialValues({
                ...pageData?.findPracticeAreaById?.page
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
            if (values.pageImage instanceof File) {
                const file = values.pageImage;
                const { fileKey, publicUrl } = await uploadImage(client, file, {
                    maxSizeMB: 3
                });

                payload.pageImage = publicUrl; // or fileKey depending on backend
            }

            /** CREATE vs UPDATE */
            if (id) {
                const { _id, slug, createdAt, updatedAt, pageType, author, ...others } = payload;
                console.log('formattedPayload', others);
                await handleUpdatePage({
                    variables: {
                        body: {
                            ...others,
                            id: id!
                        }
                    }
                });

                handleOpenSnackbar({ message: 'Page updated successfully', alertType: 'success' });
            } else {
                const { pageType, ...formattedPayload } = payload;
                console.log('formattedPayload', formattedPayload);
                await handleCreatePage({
                    variables: {
                        body: formattedPayload
                    }
                });

                handleOpenSnackbar({ message: 'Page created successfully', alertType: 'success' });
            }

            navigate(`${PracticeAreaPath}/list`, { state: { refetch: true } });
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
                validationSchema={pageValidationSchema}
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
                    isSubmitting
                    /* and other goodies */
                }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <MainCard title={id ? `Edit practice area` : 'Add new practice area'} sx={{ position: 'relative' }}>
                                <Grid container spacing={2}>
                                    <Grid container item lg={6} spacing={2}>
                                        {/* <Grid item xs={12}>
                                            <InputLabel>Pages type *</InputLabel>
                                            <TextField
                                                id="page-type"
                                                name="pageType"
                                                select
                                                value={id ? values.pageType : PageTypeMapp[values?.pageType]}
                                                fullWidth
                                                onChange={handleChange}
                                                disabled={id ? true : false}
                                            >
                                                {PageTypes.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            {touched.pageType && errors.pageType && (
                                                <FormHelperText error id="pageType-error">
                                                    {errors.pageType}
                                                </FormHelperText>
                                            )}
                                        </Grid> */}
                                        <Grid item xs={12}>
                                            <InputLabel>Page title *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="title"
                                                placeholder="Enter Title"
                                                value={values.title}
                                                name="title"
                                                onBlur={handleBlur}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                    !id ? setFieldValue('slug', slugify(event.target.value).toLowerCase()) : null;
                                                }}
                                            />
                                            {touched.title && errors.title && (
                                                <FormHelperText error id="title-error">
                                                    {errors.title}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InputLabel>Slug *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="slug"
                                                placeholder="Enter slug"
                                                value={values.slug}
                                                name="slug"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled={true}
                                            />
                                            {touched.slug && errors.slug && (
                                                <FormHelperText error id="slug-error">
                                                    {errors.slug}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InputLabel>Meta data *</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="metaData"
                                                placeholder="Enter Meta Data"
                                                value={values.metaData}
                                                name="metaData"
                                                onBlur={handleBlur}
                                                onChange={(event) => {
                                                    handleChange(event);
                                                }}
                                            />
                                            {touched.metaData && errors.metaData && (
                                                <FormHelperText error id="metaData-error">
                                                    {errors.metaData}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InputLabel>Page Image *</InputLabel>

                                            {/* Image Upload Container */}
                                            <div
                                                onClick={() => document.getElementById('pageImageInput')?.click()}
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
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
                                                {values.pageImage === '' && <span style={{ color: '#aaa' }}>Upload page image here</span>}

                                                {/* Image Preview */}
                                                {values.pageImage && (
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
                                                                values.pageImage instanceof File
                                                                    ? URL.createObjectURL(values.pageImage)
                                                                    : values.pageImage
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
                                                                setFieldValue('pageImage', '');
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
                                                    id="pageImageInput"
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0];
                                                        if (!file) return;
                                                        setFieldValue('pageImage', file); // now holds File instead of URL
                                                    }}
                                                />
                                            </div>

                                            {touched.pageImage && errors.pageImage && (
                                                <FormHelperText error id="pageImage-error">
                                                    {errors.pageImage}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
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
                                        <Grid item xs={12}>
                                            <InputLabel>Seo title</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="seo-title"
                                                placeholder="Seo title"
                                                value={values.seoTags?.title}
                                                name="seoTags.title"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {touched.seoTags?.title && errors.seoTags?.title && (
                                                <FormHelperText error id="seo-title-error">
                                                    {errors.seoTags?.title}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InputLabel>Seo tags</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="seo-tags"
                                                placeholder="Tags"
                                                value={values.seoTags?.tags}
                                                name="seoTags.tags"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {touched.seoTags?.tags && errors.seoTags?.tags && (
                                                <FormHelperText error id="seo-tags-error">
                                                    {errors.seoTags?.tags}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Grid container item xs={12} lg={10} spacing={2}>
                                        <Grid item xs={12}>
                                            <InputLabel>Seo description</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="seo-description"
                                                placeholder="Seo description"
                                                value={values.seoTags?.description}
                                                name="seoTags.description"
                                                multiline
                                                rows={4}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {touched.seoTags?.description && errors.seoTags?.description && (
                                                <FormHelperText error id="seo-description-error">
                                                    {errors.seoTags?.description}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InputLabel>Content *</InputLabel>
                                            <QuillEditor value={values.content} setFieldValue={setFieldValue} fieldName="content" />
                                            {touched.content && errors.content && (
                                                <FormHelperText error id="pageType-error">
                                                    {errors.content}
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

export default AddEditPagePracticeArea;
