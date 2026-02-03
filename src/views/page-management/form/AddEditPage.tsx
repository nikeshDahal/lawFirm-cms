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
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadImage } from 'utils/imageUploader';
import { useApolloClient } from '@apollo/client';

const AddEditPage = () => {
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
        seoTags: {
            title: '',
            tags: '',
            description: ''
        },
        recognitions: [
            { title: '', subtitle: '', description: '', icon: '' },
            { title: '', subtitle: '', description: '', icon: '' },
            { title: '', subtitle: '', description: '', icon: '' },
            { title: '', subtitle: '', description: '', icon: '' }
        ],
        yearsOfExperience: null,
        subTitle: '',
        metaData: {
            secondaryTitle: '',
            secondarySubTitle: '',
            description: '',
            items: [
                { title: '', description: '' },
                { title: '', description: '' }
            ]
        },
        contactInfo: {
            primaryEmail: '',
            secondaryEmail: '',
            primaryPhone: '',
            secondaryPhone: ''
        },
        socialMedia: {
            facebook: '',
            instagram: '',
            linkedIn: '',
            youtube: '',
            tiktok: '',
            twitter: ''
        },
        location: {
            label: '',
            address: '',
            city: '',
            country: ''
        },
        officeHour: {
            day: '',
            note: ''
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
        /** IMAGE UPLOAD */
        const updatedRecognitions = await Promise.all(
            values.recognitions.map(async (rec: any) => {
                if (rec.icon instanceof File) {
                    const { fileKey, publicUrl } = await uploadImage(client, rec.icon, {
                        maxSizeMB: 3
                    });

                    return {
                        ...rec,
                        icon: publicUrl // or fileKey
                    };
                }

                return rec;
            })
        );

        const payload = {
            ...values,
            recognitions: updatedRecognitions
        };
        if (id) {
            try {
                const { _id, slug, createdAt, updatedAt, author, ...others } = payload;

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
                        ...payload
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
                    isSubmitting,
                    setFieldTouched

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

                                        {![PageTypeEnum.HOME, PageTypeEnum.RECOGNITION].includes(values.pageType as PageTypeEnum) && (
                                            <Grid item xs={12} md={6}>
                                                <InputLabel>Page subtitle</InputLabel>
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
                                        )}

                                        {values.pageType === PageTypeEnum.ABOUT && (
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
                                        )}

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
                                                        <Grid item xs={12} md={6}>
                                                            <InputLabel>Recognition Icon *</InputLabel>

                                                            <div
                                                                onClick={() => document.getElementById(`recognitionIcon-${index}`)?.click()}
                                                                style={{
                                                                    width: 90,
                                                                    height: 90,
                                                                    borderRadius: '50%',
                                                                    border: `2px dashed ${
                                                                        touched.recognitions?.[index]?.icon &&
                                                                        typeof errors.recognitions?.[index] === 'object' &&
                                                                        errors.recognitions?.[index]?.icon
                                                                            ? '#d32f2f' // MUI error red
                                                                            : '#11382C'
                                                                    }`,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    cursor: 'pointer',
                                                                    position: 'relative',
                                                                    backgroundColor: '#f9f9f9'
                                                                }}
                                                            >
                                                                {/* Placeholder */}
                                                                {!recognition.icon && (
                                                                    <span
                                                                        style={{
                                                                            fontSize: 12,
                                                                            color: '#aaa',
                                                                            textAlign: 'center'
                                                                        }}
                                                                    >
                                                                        Upload
                                                                    </span>
                                                                )}

                                                                {/* Preview */}
                                                                {recognition.icon && (
                                                                    <>
                                                                        <img
                                                                            src={
                                                                                recognition.icon instanceof File
                                                                                    ? URL.createObjectURL(recognition.icon)
                                                                                    : recognition.icon
                                                                            }
                                                                            alt="Recognition Icon"
                                                                            style={{
                                                                                width: '100%',
                                                                                height: '100%',
                                                                                objectFit: 'cover',
                                                                                borderRadius: '50%'
                                                                            }}
                                                                        />

                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setFieldValue(`recognitions.${index}.icon`, '');
                                                                            }}
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: -8,
                                                                                right: -8,
                                                                                backgroundColor: '#fff',
                                                                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                                                                color: 'red'
                                                                            }}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </>
                                                                )}

                                                                {/* Hidden input */}
                                                                <input
                                                                    id={`recognitionIcon-${index}`}
                                                                    type="file"
                                                                    accept="image/*"
                                                                    hidden
                                                                    onChange={(e) => {
                                                                        const file = e.currentTarget.files?.[0];
                                                                        if (!file) return;

                                                                        setFieldValue(`recognitions.${index}.icon`, file);
                                                                        setFieldTouched(`recognitions.${index}.icon`, false);
                                                                    }}
                                                                    onBlur={() => setFieldTouched(`recognitions.${index}.icon`, true)}
                                                                />
                                                            </div>

                                                            {/* Error text */}
                                                            {touched.recognitions?.[index]?.icon &&
                                                                typeof errors.recognitions?.[index] === 'object' &&
                                                                errors.recognitions?.[index]?.icon && (
                                                                    <FormHelperText error>
                                                                        {errors.recognitions?.[index]?.icon}
                                                                    </FormHelperText>
                                                                )}
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
                                                        <Grid item xs={12}>
                                                            <InputLabel>Meta Data Item {index + 1} </InputLabel>
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <InputLabel>Item Title*</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                id={`meta-data-item-${index}-title`}
                                                                placeholder="Item title"
                                                                value={item.title}
                                                                name={`metaData.items.${index}.title`}
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
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
                                                                onChange={handleChange}
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

                                    {/* =================== Contact Info Section =================== */}
                                    {values.pageType === PageTypeEnum.CONTACT && (
                                        <>
                                            <Grid item xs={12} mt={3}>
                                                <strong>Contact Information</strong>
                                                <Divider sx={{ mb: 2, mt: 1 }} />
                                            </Grid>

                                            <Grid container item spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Primary Email</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="contact-primary-email"
                                                        placeholder="Primary email"
                                                        value={values.contactInfo?.primaryEmail}
                                                        name="contactInfo.primaryEmail"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.contactInfo?.primaryEmail && errors.contactInfo?.primaryEmail && (
                                                        <FormHelperText error>{errors.contactInfo?.primaryEmail}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Secondary Email</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="contact-secondary-email"
                                                        placeholder="Secondary email"
                                                        value={values.contactInfo?.secondaryEmail}
                                                        name="contactInfo.secondaryEmail"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.contactInfo?.secondaryEmail && errors.contactInfo?.secondaryEmail && (
                                                        <FormHelperText error>{errors.contactInfo?.secondaryEmail}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Primary Phone</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="contact-primary-phone"
                                                        placeholder="Primary phone"
                                                        value={values.contactInfo?.primaryPhone}
                                                        name="contactInfo.primaryPhone"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.contactInfo?.primaryPhone && errors.contactInfo?.primaryPhone && (
                                                        <FormHelperText error>{errors.contactInfo?.primaryPhone}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Secondary Phone</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="contact-secondary-phone"
                                                        placeholder="Secondary phone"
                                                        value={values.contactInfo?.secondaryPhone}
                                                        name="contactInfo.secondaryPhone"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.contactInfo?.secondaryPhone && errors.contactInfo?.secondaryPhone && (
                                                        <FormHelperText error>{errors.contactInfo?.secondaryPhone}</FormHelperText>
                                                    )}
                                                </Grid>
                                            </Grid>

                                            <Grid item xs={12} mt={3}>
                                                <strong>Social media accounts</strong>
                                                <Divider sx={{ mb: 2, mt: 1 }} />
                                            </Grid>
                                            <Grid container item spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Facebook</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="contact-facebook-url"
                                                        placeholder="Facebook URL"
                                                        value={values.socialMedia?.facebook}
                                                        name="socialMedia.facebook"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.socialMedia?.facebook && errors.socialMedia?.facebook && (
                                                        <FormHelperText error>{errors.socialMedia?.facebook}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Twitter</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="contact-twitter-url"
                                                        placeholder="Twitter URL"
                                                        value={values.socialMedia?.twitter}
                                                        name="socialMedia.twitter"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.socialMedia?.twitter && errors.socialMedia?.twitter && (
                                                        <FormHelperText error>{errors.socialMedia?.twitter}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>LinkedIn</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="contact-linkedin-url"
                                                        placeholder="LinkedIn URL"
                                                        value={values.socialMedia?.linkedIn}
                                                        name="socialMedia.linkedIn"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.socialMedia?.linkedIn && errors.socialMedia?.linkedIn && (
                                                        <FormHelperText error>{errors.socialMedia?.linkedIn}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Instagram</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="contact-instagram-url"
                                                        placeholder="Instagram URL"
                                                        value={values.socialMedia?.instagram}
                                                        name="socialMedia.instagram"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.socialMedia?.instagram && errors.socialMedia?.instagram && (
                                                        <FormHelperText error>{errors.socialMedia?.instagram}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>YouTube</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="contact-youtube-url"
                                                        placeholder="YouTube URL"
                                                        value={values.socialMedia?.youtube}
                                                        name="socialMedia.youtube"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.socialMedia?.youtube && errors.socialMedia?.youtube && (
                                                        <FormHelperText error>{errors.socialMedia?.youtube}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>TTikTok</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="contact-tiktok-url"
                                                        placeholder="TikTok URL"
                                                        value={values.socialMedia?.tiktok}
                                                        name="socialMedia.tiktok"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.socialMedia?.tiktok && errors.socialMedia?.tiktok && (
                                                        <FormHelperText error>{errors.socialMedia?.tiktok}</FormHelperText>
                                                    )}
                                                </Grid>
                                            </Grid>

                                            <Grid item xs={12} mt={3}>
                                                <strong>Office location</strong>
                                                <Divider sx={{ mb: 2, mt: 1 }} />
                                            </Grid>

                                            <Grid container item spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Office type *</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="office-location"
                                                        placeholder="Enter office type eg : Head Office"
                                                        value={values.location.label}
                                                        name="location.label"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.location?.label && errors.location?.label && (
                                                        <FormHelperText error>{errors.location?.label}</FormHelperText>
                                                    )}
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Office address *</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="office-location"
                                                        placeholder="Enter office location eg : Legal plaza , Kathmandu"
                                                        value={values.location.address}
                                                        name="location.address"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.location?.address && errors.location?.address && (
                                                        <FormHelperText error>{errors.location?.address}</FormHelperText>
                                                    )}
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>City *</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="office-city"
                                                        placeholder="Enter office city eg : Kathmandu"
                                                        value={values.location.city}
                                                        name="location.city"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.location?.city && errors.location?.city && (
                                                        <FormHelperText error>{errors.location?.city}</FormHelperText>
                                                    )}
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Country *</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="office-country"
                                                        placeholder="Enter office country eg : Nepal"
                                                        value={values.location.country}
                                                        name="location.country"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.location?.country && errors.location?.country && (
                                                        <FormHelperText error>{errors.location?.country}</FormHelperText>
                                                    )}
                                                </Grid>
                                            </Grid>

                                            <Grid item xs={12} mt={3}>
                                                <strong>Office hours</strong>
                                                <Divider sx={{ mb: 2, mt: 1 }} />
                                            </Grid>

                                            <Grid container item spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Office working day and hours *</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="office-working-hours"
                                                        placeholder="Enter working hours eg : Mon-Fri 9:00 AM - 5:00 PM"
                                                        value={values.officeHour.day}
                                                        name="officeHour.day"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.officeHour?.day && errors.officeHour?.day && (
                                                        <FormHelperText error>{errors.officeHour?.day}</FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <InputLabel>Note *</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="office-working-hours"
                                                        placeholder="Enter note: e.g. Closed on public holidays"
                                                        value={values.officeHour.note}
                                                        name="officeHour.note"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.officeHour?.note && errors.officeHour?.note && (
                                                        <FormHelperText error>{errors.officeHour?.note}</FormHelperText>
                                                    )}
                                                </Grid>
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

                                    {[
                                        PageTypeEnum.HOME,
                                        PageTypeEnum.RECOGNITION,
                                        PageTypeEnum.ABOUT,
                                        PageTypeEnum.FAQ,
                                        PageTypeEnum.CONTACT,
                                        PageTypeEnum.TERMS_AND_CONDITION,
                                        PageTypeEnum.PRIVACY_POLICY
                                    ].includes(values.pageType as PageTypeEnum) && (
                                        <>
                                            <Grid item xs={12} mt={3}>
                                                <strong>Page Content</strong>
                                                <Divider sx={{ mb: 2, mt: 1 }} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <InputLabel>Content *</InputLabel>
                                                <QuillEditor value={values.content} setFieldValue={setFieldValue} fieldName="content" />
                                                {touched.content && errors.content && (
                                                    <FormHelperText error>{errors.content}</FormHelperText>
                                                )}
                                            </Grid>
                                        </>
                                    )}
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
