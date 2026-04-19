import { useEffect, useRef, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, TextField, FormHelperText, Stack, Button, MenuItem, Paper, IconButton, Box } from '@mui/material';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { PageStatus } from '../constants/variables';
import { useGQL } from '../hooks/useGQL';
import useSnackbar from '../hooks/useSnackbar';
import { TeamPath } from 'routes/PageManagementRoutes';
import DeleteIcon from '@mui/icons-material/Delete';
import { UPLOAD_IMAGE_MAX_SIZE_MB, uploadImage } from 'utils/imageUploader';
import { useApolloClient } from '@apollo/client';
import ConfirmationDialog from '../constants/components/ConfirmationDialog';
import { teamValidationSchema } from '../validations';

const AddEditTeamPage = () => {
    const client = useApolloClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState({
        name: '',
        slug: '',
        designation: '',
        practiceArea: '',
        profileImage: '' as string | File | null,
        status: '',
        facebook: '',
        email: '',
        linkedIn: '',
        twitter: '',
        contactNumber: '',
        about: '',
        experiences: '',
        languages: '',
        qualifications: '',
        others: '',
        seoTags: {
            title: '',
            description: '',
            tags: ''
        }
    });

    const { handleOpenSnackbar } = useSnackbar();

    const formRef = useRef<FormikProps<typeof initialValues>>(null);

    const { CREATE_TEAM, UPDATE_TEAM, GET_TEAM } = useGQL();
    const [handleCreateTeam, { data }] = CREATE_TEAM();
    const { data: teamData, loading: teamDataLoading } = GET_TEAM(id!);
    const [handleUpdateTeam] = UPDATE_TEAM();
    const breadcrumbLinks = [
        { title: 'Team Management', to: `${TeamPath}/list` },
        { title: id ? `Edit ${teamDataLoading ? '' : teamData?.findTeamById?.page?.name}` : 'Add new team member' }
    ];

    useEffect(() => {
        if (teamData?.findTeamById?.page) {
            const page = teamData.findTeamById.page;

            setInitialValues({
                ...page,
                slug: page.slug ?? '',
                status: page.status?.toUpperCase() ?? 'INACTIVE',
                facebook: page.socialLinks?.facebook ?? '',
                linkedIn: page.socialLinks?.linkedin ?? '',
                twitter: page.socialLinks?.twitter ?? '',
                email: page.socialLinks?.email ?? '',
                contactNumber: page.socialLinks?.contactNumber ?? '',
                about: page.about ?? '',
                experiences: page.experiences ?? '',
                languages: page.languages ?? '',
                qualifications: page.qualifications ?? '',
                others: page.others ?? '',
                seoTags: {
                    title: page.seoTags?.title ?? '',
                    description: page.seoTags?.description ?? '',
                    tags: page.seoTags?.tags ?? ''
                }
            });
        }
    }, [teamData]);

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
            if (values.profileImage instanceof File) {
                const file = values.profileImage;
                const { fileKey, publicUrl } = await uploadImage(client, file, {
                    maxSizeMB: UPLOAD_IMAGE_MAX_SIZE_MB
                });

                payload.profileImage = publicUrl; // or fileKey depending on backend
            }

            /** CREATE vs UPDATE */
            if (id) {
                const { _id, createdAt, updatedAt, socialLinks, ...others } = payload;
                await handleUpdateTeam({
                    variables: {
                        body: {
                            ...others,
                            id: id!
                        }
                    }
                });

                handleOpenSnackbar({ message: 'Team member updated successfully', alertType: 'success' });
            } else {
                const { ...formattedPayload } = payload;
                await handleCreateTeam({
                    variables: {
                        body: formattedPayload
                    }
                });

                handleOpenSnackbar({ message: 'Team member created successfully', alertType: 'success' });
            }

            navigate(`${TeamPath}/list`, { state: { refetch: true } });
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
                validationSchema={teamValidationSchema}
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
                            <MainCard title={id ? `Edit team member` : 'Add new team member'} sx={{ position: 'relative' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} mt={1}>
                                        <strong>Team Member Information</strong>
                                    </Grid>
                                    <Grid container item spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <InputLabel>Profile Image *</InputLabel>

                                            {/* Image Upload Container */}
                                            <div
                                                onClick={() => document.getElementById('profileImageInput')?.click()}
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
                                                {(values.profileImage === '' || values.profileImage === null) && (
                                                    <span style={{ color: '#aaa' }}>Upload profile image here</span>
                                                )}

                                                {/* Image Preview */}
                                                {values.profileImage && (
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
                                                                values.profileImage instanceof File
                                                                    ? URL.createObjectURL(values.profileImage)
                                                                    : values.profileImage
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
                                                                setFieldValue('profileImage', '');
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
                                                    id="profileImageInput"
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0];
                                                        if (!file) return;
                                                        setFieldValue('profileImage', file);
                                                        setFieldTouched('profileImage', false);
                                                    }}
                                                    onBlur={() => setFieldTouched('profileImage', true)}
                                                />
                                            </div>

                                            {touched.profileImage && errors.profileImage && (
                                                <FormHelperText error id="profileImage-error">
                                                    {errors.profileImage}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={2}>
                                                <div>
                                                    <InputLabel>Name *</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="name"
                                                        placeholder="Enter name"
                                                        value={values.name}
                                                        name="name"
                                                        onBlur={handleBlur}
                                                        onChange={(event) => {
                                                            handleChange(event);
                                                            // Auto-generate slug from name
                                                            const nameValue = event.target.value;
                                                            const slug = nameValue
                                                                .toLowerCase()
                                                                .trim()
                                                                .replace(/[^\w\s-]/g, '')
                                                                .replace(/\s+/g, '-')
                                                                .replace(/-+/g, '-');
                                                            setFieldValue('slug', slug);
                                                        }}
                                                    />
                                                    {touched.name && errors.name && (
                                                        <FormHelperText error id="name-error">
                                                            {errors.name}
                                                        </FormHelperText>
                                                    )}
                                                </div>

                                                <div>
                                                    <InputLabel>Slug</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="slug"
                                                        placeholder="auto-generated-from-name"
                                                        value={values.slug}
                                                        name="slug"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.slug && errors.slug && (
                                                        <FormHelperText error id="slug-error">
                                                            {errors.slug}
                                                        </FormHelperText>
                                                    )}
                                                </div>

                                                <div>
                                                    <InputLabel>Designation *</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="designation"
                                                        placeholder="Enter designation"
                                                        value={values.designation}
                                                        name="designation"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.designation && errors.designation && (
                                                        <FormHelperText error id="designation-error">
                                                            {errors.designation}
                                                        </FormHelperText>
                                                    )}
                                                </div>

                                                <div>
                                                    <InputLabel>Practice Area *</InputLabel>
                                                    <TextField
                                                        fullWidth
                                                        id="practiceArea"
                                                        placeholder="Enter practice area"
                                                        value={values.practiceArea}
                                                        name="practiceArea"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                    {touched.practiceArea && errors.practiceArea && (
                                                        <FormHelperText error id="practiceArea-error">
                                                            {errors.practiceArea}
                                                        </FormHelperText>
                                                    )}
                                                </div>

                                                <div>
                                                    <InputLabel>Status *</InputLabel>
                                                    <TextField
                                                        id="team-status"
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
                                                </div>
                                            </Stack>
                                        </Grid>

                                        {/* =================== Professional Information Section =================== */}
                                        <Grid container item spacing={2}>
                                            <Grid item xs={12} mt={1}>
                                                <strong>Professional Information</strong>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <InputLabel>About</InputLabel>
                                                <Box
                                                    sx={{
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        '& .ql-container': {
                                                            minHeight: '200px',
                                                            fontSize: '14px'
                                                        },
                                                        '& .ql-editor': {
                                                            minHeight: '200px'
                                                        }
                                                    }}
                                                >
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={values.about}
                                                        onChange={(content) => setFieldValue('about', content)}
                                                        onBlur={() => setFieldTouched('about', true)}
                                                    />
                                                </Box>
                                                {touched.about && errors.about && (
                                                    <FormHelperText error id="about-error">
                                                        {errors.about}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={12}>
                                                <InputLabel>Experiences</InputLabel>
                                                <Box
                                                    sx={{
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        '& .ql-container': {
                                                            minHeight: '200px',
                                                            fontSize: '14px'
                                                        },
                                                        '& .ql-editor': {
                                                            minHeight: '200px'
                                                        }
                                                    }}
                                                >
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={values.experiences}
                                                        onChange={(content) => setFieldValue('experiences', content)}
                                                        onBlur={() => setFieldTouched('experiences', true)}
                                                    />
                                                </Box>
                                                {touched.experiences && errors.experiences && (
                                                    <FormHelperText error id="experiences-error">
                                                        {errors.experiences}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <InputLabel>Languages</InputLabel>
                                                <Box
                                                    sx={{
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        '& .ql-container': {
                                                            minHeight: '150px',
                                                            fontSize: '14px'
                                                        },
                                                        '& .ql-editor': {
                                                            minHeight: '150px'
                                                        }
                                                    }}
                                                >
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={values.languages}
                                                        onChange={(content) => setFieldValue('languages', content)}
                                                        onBlur={() => setFieldTouched('languages', true)}
                                                    />
                                                </Box>
                                                {touched.languages && errors.languages && (
                                                    <FormHelperText error id="languages-error">
                                                        {errors.languages}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <InputLabel>Qualifications</InputLabel>
                                                <Box
                                                    sx={{
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        '& .ql-container': {
                                                            minHeight: '150px',
                                                            fontSize: '14px'
                                                        },
                                                        '& .ql-editor': {
                                                            minHeight: '150px'
                                                        }
                                                    }}
                                                >
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={values.qualifications}
                                                        onChange={(content) => setFieldValue('qualifications', content)}
                                                        onBlur={() => setFieldTouched('qualifications', true)}
                                                    />
                                                </Box>
                                                {touched.qualifications && errors.qualifications && (
                                                    <FormHelperText error id="qualifications-error">
                                                        {errors.qualifications}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={12}>
                                                <InputLabel>Others</InputLabel>
                                                <Box
                                                    sx={{
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        '& .ql-container': {
                                                            minHeight: '200px',
                                                            fontSize: '14px'
                                                        },
                                                        '& .ql-editor': {
                                                            minHeight: '200px'
                                                        }
                                                    }}
                                                >
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={values.others}
                                                        onChange={(content) => setFieldValue('others', content)}
                                                        onBlur={() => setFieldTouched('others', true)}
                                                    />
                                                </Box>
                                                {touched.others && errors.others && (
                                                    <FormHelperText error id="others-error">
                                                        {errors.others}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                        </Grid>

                                        {/* =================== Social Links Section =================== */}
                                        <Grid container item spacing={2}>
                                            <Grid item xs={12} mt={1}>
                                                <strong>Social Links</strong>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <InputLabel>Facebook URL</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="facebook"
                                                    placeholder="https://facebook.com/username"
                                                    value={values.facebook}
                                                    name="facebook"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched?.facebook && errors?.facebook && (
                                                    <FormHelperText error id="facebook-error">
                                                        {errors.facebook}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <InputLabel>Email *</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="email"
                                                    placeholder="email@example.com"
                                                    value={values.email}
                                                    name="email"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched?.email && errors?.email && (
                                                    <FormHelperText error id="email-error">
                                                        {errors.email}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <InputLabel>LinkedIn URL</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="linkedIn"
                                                    placeholder="https://linkedin.com/in/username"
                                                    value={values.linkedIn}
                                                    name="linkedIn"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched?.linkedIn && errors?.linkedIn && (
                                                    <FormHelperText error id="linkedIn-error">
                                                        {errors.linkedIn}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <InputLabel>Twitter URL</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="twitter"
                                                    placeholder="https://twitter.com/username"
                                                    value={values.twitter}
                                                    name="twitter"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched?.twitter && errors?.twitter && (
                                                    <FormHelperText error id="twitter-error">
                                                        {errors.twitter}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <InputLabel>Contact Number</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="contactNumber"
                                                    placeholder="+977 9800000000"
                                                    value={values.contactNumber}
                                                    name="contactNumber"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched?.contactNumber && errors?.contactNumber && (
                                                    <FormHelperText error id="contactNumber-error">
                                                        {errors.contactNumber}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                        </Grid>

                                        {/* =================== SEO Details Section =================== */}
                                        <Grid container item spacing={2}>
                                            <Grid item xs={12} mt={1}>
                                                <strong>SEO Details</strong>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <InputLabel>Title</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="seoTags.title"
                                                    placeholder="Enter SEO title"
                                                    value={values.seoTags?.title || ''}
                                                    name="seoTags.title"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        setFieldValue('seoTags.title', e.target.value);
                                                    }}
                                                />
                                                {touched?.seoTags?.title && errors?.seoTags?.title && (
                                                    <FormHelperText error id="seoTags.title-error">
                                                        {errors?.seoTags?.title}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={12}>
                                                <InputLabel>Description</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="seoTags.description"
                                                    placeholder="Enter SEO description"
                                                    value={values.seoTags?.description || ''}
                                                    name="seoTags.description"
                                                    multiline
                                                    rows={3}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        setFieldValue('seoTags.description', e.target.value);
                                                    }}
                                                />
                                                {touched?.seoTags?.description && errors?.seoTags?.description && (
                                                    <FormHelperText error id="seoTags.description-error">
                                                        {errors?.seoTags?.description}
                                                    </FormHelperText>
                                                )}
                                            </Grid>

                                            <Grid item xs={12}>
                                                <InputLabel>Tags</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="seoTags.tags"
                                                    placeholder="Enter tags separated by commas"
                                                    value={values.seoTags?.tags || ''}
                                                    name="seoTags.tags"
                                                    multiline
                                                    rows={2}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        setFieldValue('seoTags.tags', e.target.value);
                                                    }}
                                                />
                                                {touched?.seoTags?.tags && errors?.seoTags?.tags && (
                                                    <FormHelperText error id="seoTags.tags-error">
                                                        {errors?.seoTags?.tags}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
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
                                                navigate(`${TeamPath}/list`);
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
                    title={'Update team member details'}
                    content={'Are you sure you want to update team member details ?'}
                    yes={handleSubmitExternally}
                    buttonLabelYes={'Yes'}
                    buttonLabelNo={'No'}
                />
            ) : null}
        </>
    );
};

export default AddEditTeamPage;
