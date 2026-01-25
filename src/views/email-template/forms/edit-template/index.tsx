import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { useGQL } from '../../hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import { useNavigate, useParams } from 'react-router-dom';
import { EmailTemplate } from '../../types';
import FailureLoad from 'components/spinner/fail';
import { useDialog } from 'views/user-management/admins/hooks/useDialogs';

import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid, TextField, Typography, FormHelperText, Box, InputLabel, Stack } from '@mui/material';
import { ChipWrapper } from '../../components/form/form.styles';
import { chipValues, validationSchema } from '../../constants';
import { ChipCopyText } from 'views/email-template/components/chip-copy-text/ChipCopyText';
import { GridDivider } from 'components/divider/Divider';
import { EmailTemplatePreviewDialog } from 'views/email-template/emailTemplate.styles';
import { ButtonWrapper } from 'components/buttons/button.styles';
import CustomLoader from 'components/loader';
import QuillEditor from '../../components/QuillEditor';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

const EditTemplate = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [template, setTemplate] = useState<Partial<EmailTemplate>>();

    const { UPDATE_TEMPLATE, GET_TEMPLATE, VIEW_TEMPLATE } = useGQL();
    const { handleOpenSnackbar } = useSnackbar();
    const [previewBody, setPreviewBody] = useState('<h1>This is Email template<h1>');
    const { error, loading, data: templateData, refetch } = GET_TEMPLATE(id!);
    const [handleUpdateTemplate, { data }] = UPDATE_TEMPLATE();
    const { data: templateData1 } = VIEW_TEMPLATE(previewBody);
    const { openDialog, handleDialogClose, handleDialogOpen } = useDialog();
    const [editorState, setEditorState] = useState<any>('');
    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (templateData?.getEmailTemplate) {
            setTemplate(templateData?.getEmailTemplate?.emailTemplate || {});
            setEditorState(templateData?.getEmailTemplate?.emailTemplate?.body);
        }
    }, [templateData]);

    useEffect(() => {
        if (data?.updateEmailTemplate) {
            handleOpenSnackbar({ message: `${data?.updateEmailTemplate?.message!}. Redirecting...`, alertType: 'success' });
            setTimeout(() => {
                navigate('/email-template/list');
            }, 2000);
        }
    }, [data, navigate]);

    const handlePreviewTemplate = () => {
        if (editorState === '' || editorState === '<p><br></p>') {
            handleOpenSnackbar({ message: 'Email template body is required for the preview.', alertType: 'error' });
        } else if (editorState) {
            setPreviewBody(editorState);
            handleDialogOpen();
        } else {
            setPreviewBody(editorState);
            handleDialogOpen();
        }
    };

    const handleFormSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
        if (editorState) {
            try {
                const { _id, slug, createdAt, updatedAt, ...others } = values;
                await handleUpdateTemplate({
                    variables: {
                        id: template?._id!,
                        input: {
                            ...others,
                            status: template?.status
                        }
                    }
                });
                setSubmitting(false);
            } catch (err: any) {
                handleOpenSnackbar({
                    message: data?.createEmailTemplate?.message! || 'Email template body is not defined',
                    alertType: 'error'
                });
                setSubmitting(false);
            }
        } else {
            handleOpenSnackbar({ message: 'Email template body is not defined', alertType: 'error' });
            setSubmitting(false);
        }
    };

    const breadcrumbLinks = [
        { title: 'Email template management', to: '/email-template/list' },
        {
            title: `Edit ${loading ? '' : template?.title}`
        }
    ];

    return (
        <>
            <Stack className="custom-breadcrumb">
                <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
            </Stack>
            {loading || !template ? (
                <CustomLoader />
            ) : error ? (
                <FailureLoad />
            ) : (
                <>
                    <Formik
                        enableReinitialize
                        initialValues={template}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => handleFormSubmit(values, setSubmitting)}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => {
                            setEditorState(values.body);
                            return (
                                <form onSubmit={handleSubmit}>
                                    <MainCard title="Edit email template">
                                        <Grid container item md={12} spacing={2} alignItems="center">
                                            <Grid item xs={12}>
                                                <InputLabel>Template name *</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="title"
                                                    placeholder="Enter Title"
                                                    value={values.title}
                                                    name="title"
                                                    onBlur={handleBlur}
                                                    onChange={(event) => {
                                                        handleChange(event);
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
                                                    placeholder="Enter Slug"
                                                    value={values.slug}
                                                    name="slug"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                                {touched.slug && errors.slug && (
                                                    <FormHelperText error id="slug-error">
                                                        {errors.slug}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <InputLabel>Subject *</InputLabel>
                                                <TextField
                                                    fullWidth
                                                    id="subject"
                                                    placeholder="Enter Subject"
                                                    value={values.subject}
                                                    name="subject"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {touched.subject && errors.subject && (
                                                    <FormHelperText error id="subject-error">
                                                        {errors.subject}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2">
                                                    Placeholders
                                                    <p style={{ fontSize: '10px' }}>
                                                        Note: Use these placeholder according to requirement of your email body{' '}
                                                    </p>
                                                </Typography>
                                                <ChipWrapper>{chipValues.map((chip, index) => ChipCopyText(chip, index))}</ChipWrapper>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <InputLabel>Email body *</InputLabel>
                                                <QuillEditor value={values.body} setFieldValue={setFieldValue} fieldName="body" />
                                                {touched.body && errors.body && (
                                                    <FormHelperText error id="body-error">
                                                        {errors.body}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                            <GridDivider />
                                            <Grid item xs={12}>
                                                <ButtonWrapper>
                                                    <Button disabled={isSubmitting} variant="contained" type="submit">
                                                        Save Changes
                                                    </Button>
                                                    <Button onClick={() => handlePreviewTemplate()} variant="contained">
                                                        Preview template
                                                    </Button>
                                                </ButtonWrapper>
                                            </Grid>
                                        </Grid>
                                        <EmailTemplatePreviewDialog fullWidth maxWidth="sm" open={openDialog} onClose={handleDialogClose}>
                                            {openDialog && (
                                                <Box dangerouslySetInnerHTML={{ __html: templateData1?.readEmailTemplate?.template }} />
                                            )}
                                        </EmailTemplatePreviewDialog>
                                    </MainCard>
                                </form>
                            );
                        }}
                    </Formik>
                </>
            )}
        </>
    );
};

export default EditTemplate;
