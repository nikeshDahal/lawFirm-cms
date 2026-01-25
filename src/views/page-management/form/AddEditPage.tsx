/* eslint no-nested-ternary: 0 */
/* eslint no-underscore-dangle: 0 */

import { useEffect, useRef, useState } from 'react';
import slugify from 'slugify';
import { Formik, FormikProps } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, TextField, FormHelperText, Stack, Button, MenuItem, Paper } from '@mui/material';
import InputLabel from 'ui-component/extended/Form/InputLabel';

import { PageManagementListPath } from '../constants';
import { PageStatus, PageTypeMapp, PageTypes } from '../constants/variables';
import { pageValidationSchema } from '../validations';
import { useGQL } from '../hooks/useGQL';
import ConfirmationDialog from '../components/ConfirmationDialog';
import useSnackbar from '../hooks/useSnackbar';
import QuillEditor from '../components/QuillEditor';

const AddEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState({
        pageType: '',
        title: '',
        slug: '',
        status: '',
        content: '',
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

    const breadcrumbLinks = [
        { title: 'Page management', to: PageManagementListPath },
        { title: id ? `Edit ${pagaDataLoading ? '' : pageData?.page?.title}` : 'Add new page template' }
    ];

    useEffect(() => {
        if (pageData?.page) {
            setInitialValues({
                ...pageData?.page
            });
        }
    }, [pageData]);

    const handleSubmitExternally = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
        handleCloseModal();
    };

    const handleFormSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void, setFieldValue) => {
        if (id) {
            try {
                const { _id, slug, createdAt, updatedAt, ...others } = values;

                await handleUpdatePage({
                    variables: {
                        body: {
                            ...others,
                            id: pageData?.page?._id!
                        }
                    }
                });
                navigate('/page-management/list', { state: { refetch: true } });
                handleOpenSnackbar({ message: 'Page updated successfully', alertType: 'success' });
                setSubmitting(false);
            } catch (err: any) {
                handleOpenSnackbar({ message: 'Page updated error', alertType: 'error' });
                setSubmitting(false);
            }
        } else {
            await handleCreatePage({
                variables: {
                    body: {
                        ...values
                    }
                }
            })
                .then((success: any) => {
                    handleOpenSnackbar({ message: 'Page created successfully', alertType: 'success' });
                    navigate('/page-management/list', { state: { refetch: true } });
                })
                .catch((err: any) => {
                    handleOpenSnackbar({ message: err.message, alertType: 'error' });
                });
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
                    handleFormSubmit(values, setSubmitting, setFieldValue);
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
                            <MainCard title={id ? `Edit page template` : 'Add new page template'} sx={{ position: 'relative' }}>
                                <Grid container spacing={2}>
                                    <Grid container item lg={6} spacing={2}>
                                        <Grid item xs={12}>
                                            <InputLabel>Pages type *</InputLabel>
                                            <TextField
                                                id="page-type"
                                                name="pageType"
                                                select
                                                value={values.pageType}
                                                fullWidth
                                                onChange={handleChange}
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
                                        </Grid>
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
                                                disabled={id ? true : false}
                                            />
                                            {touched.slug && errors.slug && (
                                                <FormHelperText error id="slug-error">
                                                    {errors.slug}
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

export default AddEditPage;
