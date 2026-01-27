/* eslint no-nested-ternary: 0 */
/* eslint no-underscore-dangle: 0 */

import { useEffect, useRef, useState } from 'react';
import slugify from 'slugify';
import { FieldArray, Formik, FormikProps } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, TextField, FormHelperText, Stack, Button, MenuItem, Paper, Divider, IconButton, Input } from '@mui/material';
import InputLabel from 'ui-component/extended/Form/InputLabel';

import { PageManagementListPath } from '../constants';
import { PageStatus, PageTypes } from '../constants/variables';
import { pageValidationSchema } from '../validations';
import { useGQL } from '../hooks/useGQL';
import ConfirmationDialog from '../components/ConfirmationDialog';
import useSnackbar from '../hooks/useSnackbar';
import QuillEditor from '../components/QuillEditor';
import { PageTypeEnum } from '../constants/page-management-enum';

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
        },
        recognitions: [
            { title: '', subtitle: '', description: '' },
            { title: '', subtitle: '', description: '' },
            { title: '', subtitle: '', description: '' },
            { title: '', subtitle: '', description: '' }
        ],
        yearsOfExperience: 0,
        subTitle: '',
        metaData: {
            secondaryTitle: '',
            secondarySubTitle: '',
            description: '',
            items: [
                { title: '', description: '' },
                { title: '', description: '' }
            ]
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
                const { _id, slug, createdAt, updatedAt, author, ...others } = values;

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
                handleOpenSnackbar({ message: err.message, alertType: 'error' });
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
                                    {/* =================== Page Info Section =================== */}
                                    <Grid item xs={12} mt={1}>
                                        <strong>Page Information</strong>
                                        <Divider sx={{ mb: 2, mt: 1 }} />
                                    </Grid>

                                    <Grid container item spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Pages type *</InputLabel>
                                            <TextField
                                                id="page-type"
                                                name="pageType"
                                                select
                                                value={values.pageType}
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
                                                <FormHelperText error>{errors.pageType}</FormHelperText>
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
                                            {touched.status && errors.status && <FormHelperText error>{errors.status}</FormHelperText>}
                                        </Grid>

                                        <Grid item xs={12} md={6}>
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
                                            {touched.title && errors.title && <FormHelperText error>{errors.title}</FormHelperText>}
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Page subtitle </InputLabel>
                                            <TextField
                                                fullWidth
                                                id="subTitle"
                                                placeholder="Enter Subtitle"
                                                value={values.subTitle}
                                                name="subTitle"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {touched.subTitle && errors.subTitle && (
                                                <FormHelperText error>{errors.subTitle}</FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Years of experience </InputLabel>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                id="yearsOfExperience"
                                                placeholder="Enter years of experience"
                                                value={values.yearsOfExperience}
                                                name="yearsOfExperience"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {touched.yearsOfExperience && errors.yearsOfExperience && (
                                                <FormHelperText error>{errors.yearsOfExperience}</FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={6}>
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
                                            {touched.slug && errors.slug && <FormHelperText error>{errors.slug}</FormHelperText>}
                                        </Grid>
                                    </Grid>

                                    {/** ================== Recognition Section =================== */}
                                    {values.pageType === PageTypeEnum.RECOGNITION && (
                                        <>
                                            <Grid item xs={12} mt={3}>
                                                <strong>Recognitions</strong>
                                                <Divider sx={{ mb: 2, mt: 1 }} />
                                            </Grid>

                                            <Grid container item spacing={2}>
                                                {values.recognitions?.map((recognition: any, index: number) => (
                                                    <>
                                                        <Grid item xs={12}>
                                                            <InputLabel>Recognition {index + 1} </InputLabel>
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <InputLabel>Title *</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                placeholder="Enter recognition title"
                                                                name={`recognitions.${index}.title`}
                                                                value={recognition.title}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={Boolean(
                                                                    touched.recognitions?.[index]?.title &&
                                                                    typeof errors.recognitions?.[index] === 'object' &&
                                                                    errors.recognitions?.[index]?.title
                                                                )}
                                                                helperText={
                                                                    touched.recognitions?.[index]?.title &&
                                                                    typeof errors.recognitions?.[index] === 'object'
                                                                        ? errors.recognitions?.[index]?.title
                                                                        : ''
                                                                }
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} md={6}>
                                                            <InputLabel>Sub title *</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                placeholder="Enter recognition subtitle"
                                                                name={`recognitions.${index}.subtitle`}
                                                                value={recognition.subtitle}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={Boolean(
                                                                    touched.recognitions?.[index]?.subtitle &&
                                                                    typeof errors.recognitions?.[index] === 'object' &&
                                                                    errors.recognitions?.[index]?.subtitle
                                                                )}
                                                                helperText={
                                                                    touched.recognitions?.[index]?.subtitle &&
                                                                    typeof errors.recognitions?.[index] === 'object'
                                                                        ? errors.recognitions?.[index]?.subtitle
                                                                        : ''
                                                                }
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} md={6}>
                                                            <InputLabel>Recoginition description *</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                placeholder="Enter recognition description"
                                                                name={`recognitions.${index}.description`}
                                                                value={recognition.description}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={Boolean(
                                                                    touched.recognitions?.[index]?.description &&
                                                                    typeof errors.recognitions?.[index] === 'object' &&
                                                                    errors.recognitions?.[index]?.description
                                                                )}
                                                                helperText={
                                                                    touched.recognitions?.[index]?.description &&
                                                                    typeof errors.recognitions?.[index] === 'object'
                                                                        ? errors.recognitions?.[index]?.description
                                                                        : ''
                                                                }
                                                            />
                                                        </Grid>
                                                    </>
                                                ))}
                                            </Grid>
                                        </>
                                    )}

                                    {/* =================== Meta Data Section =================== */}
                                    {values.pageType === PageTypeEnum.ABOUT && (
                                        <>
                                            <Grid item xs={12} mt={3}>
                                                <strong>Meta Data</strong>
                                                <Divider sx={{ mb: 2, mt: 1 }} />
                                            </Grid>

                                            <Grid container item spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Secondary Title*</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="meta-secondary-title"
                                                        placeholder="Secondary title"
                                                        value={values.metaData?.secondaryTitle}
                                                        name="metaData.secondaryTitle"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.metaData?.secondaryTitle && errors.metaData?.secondaryTitle && (
                                                        <FormHelperText error>{errors.metaData?.secondaryTitle}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Secondary Sub Title*</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="meta-secondary-sub-title"
                                                        placeholder="Secondary sub title"
                                                        value={values.metaData?.secondarySubTitle}
                                                        name="metaData.secondarySubTitle"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.metaData?.secondarySubTitle && errors.metaData?.secondarySubTitle && (
                                                        <FormHelperText error>{errors.metaData?.secondarySubTitle}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <InputLabel>Description*</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="meta-description"
                                                        placeholder="Description"
                                                        value={values.metaData?.description}
                                                        name="metaData.description"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        multiline
                                                        rows={4}
                                                    />
                                                    {touched.metaData?.description && errors.metaData?.description && (
                                                        <FormHelperText error>{errors.metaData?.description}</FormHelperText>
                                                    )}
                                                </Grid>

                                                {/* =================== Meta Data Items Section =================== */}
                                                {values.metaData?.items.map((item, index) => (
                                                    <>
                                                        <Grid item xs={12} md={6}>
                                                            <InputLabel>Item Title*</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                id={`meta-data-item-${index}-title`}
                                                                placeholder="Item title"
                                                                value={item.title}
                                                                name={`metaData.items.${index}.title`}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    const newItems = [...values.metaData.items];
                                                                    newItems[index].title = e.target.value;
                                                                    setFieldValue('metaData.items', newItems);
                                                                }}
                                                                error={Boolean(
                                                                    touched.metaData?.items?.[index]?.title &&
                                                                    typeof errors.metaData?.items?.[index] === 'object' &&
                                                                    errors.metaData?.items?.[index]?.title
                                                                )}
                                                                helperText={
                                                                    touched.metaData?.items?.[index]?.title &&
                                                                    typeof errors.metaData?.items?.[index] === 'object'
                                                                        ? errors.metaData?.items?.[index]?.title
                                                                        : ''
                                                                }
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} md={6}>
                                                            <InputLabel>Item Description*</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                id={`meta-data-item-${index}-description`}
                                                                placeholder="Item description"
                                                                value={item.description}
                                                                name={`metaData.items.${index}.description`}
                                                                onBlur={handleBlur}
                                                                multiline
                                                                rows={1}
                                                                onChange={(e) => {
                                                                    const newItems = [...values.metaData.items];
                                                                    newItems[index].description = e.target.value;
                                                                    setFieldValue('metaData.items', newItems);
                                                                }}
                                                                error={Boolean(
                                                                    touched.metaData?.items?.[index]?.description &&
                                                                    typeof errors.metaData?.items?.[index] === 'object' &&
                                                                    errors.metaData?.items?.[index]?.description
                                                                )}
                                                                helperText={
                                                                    touched.metaData?.items?.[index]?.description &&
                                                                    typeof errors.metaData?.items?.[index] === 'object'
                                                                        ? errors.metaData?.items?.[index]?.description
                                                                        : ''
                                                                }
                                                            />
                                                        </Grid>
                                                    </>
                                                ))}
                                            </Grid>
                                        </>
                                    )}

                                    {/* =================== SEO Section =================== */}
                                    <Grid item xs={12} mt={3}>
                                        <strong>SEO Settings</strong>
                                        <Divider sx={{ mb: 2, mt: 1 }} />
                                    </Grid>

                                    <Grid container item spacing={2}>
                                        <Grid item xs={12} md={6}>
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
                                                <FormHelperText error>{errors.seoTags?.title}</FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={6}>
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
                                                <FormHelperText error>{errors.seoTags?.tags}</FormHelperText>
                                            )}
                                        </Grid>

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
                                                <FormHelperText error>{errors.seoTags?.description}</FormHelperText>
                                            )}
                                        </Grid>
                                    </Grid>

                                    {/* =================== Content Section =================== */}
                                    <Grid item xs={12} mt={3}>
                                        <strong>Page Content</strong>
                                        <Divider sx={{ mb: 2, mt: 1 }} />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <InputLabel>Content *</InputLabel>
                                        <QuillEditor value={values.content} setFieldValue={setFieldValue} fieldName="content" />
                                        {touched.content && errors.content && <FormHelperText error>{errors.content}</FormHelperText>}
                                    </Grid>
                                </Grid>
                            </MainCard>

                            <Paper className="form-button-wrapper" sx={{ p: 2 }}>
                                <Stack direction="row" justifyContent="flex-end" spacing={2}>
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
                                        variant="outlined"
                                        color="primary"
                                        size="large"
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </Paper>
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
