import { useEffect, useRef, useState } from 'react';

import { useGQL } from '../../hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { ChipWrapper } from '../../components/form/form.styles';

import MainCard from 'ui-component/cards/MainCard';
import slugify from 'slugify';
import { InputEmailTemplate } from '../../types';

import { chipValues, defaultValue, validationSchema } from '../../constants';
import { Button, Grid, TextField, Typography, FormHelperText, Box, Stack, InputLabel } from '@mui/material';
import { useDialog } from 'views/user-management/admins/hooks/useDialogs';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from 'store/slices/modal';
import ConfirmModal from 'components/modal/ConfirmModal';
import { ChipCopyText } from '../../components/chip-copy-text/ChipCopyText';
import { GridDivider } from 'components/divider/Divider';
import { EmailTemplatePreviewDialog } from 'views/email-template/emailTemplate.styles';
import { ButtonWrapper } from 'components/buttons/button.styles';
import QuillEditor from '../../components/QuillEditor';
import { EmailTemplateStatus } from 'store/constant';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

const MockComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const formRef = useRef<any>();
    const [editorState, setEditorState] = useState('');
    const { CREATE_TEMPLATE, VIEW_TEMPLATE } = useGQL();
    const { handleOpenSnackbar } = useSnackbar();
    const [previewBody, setPreviewBody] = useState('<h1>This is Email template<h1>');
    const [handleCreateTemplate, { data }] = CREATE_TEMPLATE();
    const { data: templateData } = VIEW_TEMPLATE(previewBody);
    const { openDialog, handleDialogClose, handleDialogOpen } = useDialog();
    const [initialValues, setInitialValues] = useState<InputEmailTemplate>(defaultValue);
    useEffect(() => {
        if (data?.createEmailTemplate) {
            handleOpenSnackbar({ message: `${data?.createEmailTemplate?.message!}. Redirecting...`, alertType: 'success' });
            setTimeout(() => {
                navigate('/email-template/list');
            }, 2000);
        }
    }, [data]);

    const handlePreviewTemplate = () => {
        if (editorState) {
            setPreviewBody(editorState.toString());
            handleDialogOpen();
        } else {
            handleOpenSnackbar({ message: 'Email template body is required for the preview.', alertType: 'error' });
        }
    };

    const handleFormSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
        if (editorState == '') {
            handleOpenSnackbar({ message: 'Email template body is not defined.', alertType: 'error' });
        } else {
            try {
                setSubmitting(true);
                await handleCreateTemplate({
                    variables: {
                        input: {
                            ...values,
                            status: EmailTemplateStatus.Active
                        }
                    }
                });
                setSubmitting(false);
                dispatch(closeModal());
            } catch (err) {
                handleOpenSnackbar({ message: data?.createEmailTemplate?.message!, alertType: 'error' });
            }

            setSubmitting(false);
        }
    };

    const handleOpenModal = () => {
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const handleSubmitExternally = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
            dispatch(closeModal());
        }
    };

    const breadcrumbLinks = [
        { title: 'Email template management', to: '/email-template/list' },
        {
            title: `Create new admin `
        }
    ];

    return (
        <>
            <Stack className="custom-breadcrumb">
                <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
            </Stack>
            <Formik
                innerRef={formRef}
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => handleFormSubmit(values, setSubmitting)}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => {
                    setEditorState(values.body);
                    return (
                        <form onSubmit={handleSubmit}>
                            <MainCard title="Add new email template">
                                <Grid container item md={6} spacing={2} alignItems="center">
                                    <Grid item xs={12}>
                                        <InputLabel>Title *</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="title"
                                            placeholder="Enter Title"
                                            value={values.title}
                                            name="title"
                                            onBlur={handleBlur}
                                            onChange={(event) => {
                                                setFieldValue(
                                                    'slug',
                                                    slugify(event.target.value, {
                                                        lower: true,
                                                        strict: true,
                                                        trim: true
                                                    })
                                                );
                                                handleChange(event);
                                            }}
                                        />
                                        {touched.title && errors.title && (
                                            <FormHelperText error id="title-error">
                                                {errors.title}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <GridDivider />
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
                                    <GridDivider />
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
                                    <GridDivider />
                                    <Grid item xs={12}>
                                        <Typography variant="body2">
                                            Placeholders
                                            <p style={{ fontSize: '10px' }}>
                                                Note: Use these placeholder according to requirement of your email body{' '}
                                            </p>
                                        </Typography>
                                        <ChipWrapper>{chipValues.map((chip, index) => ChipCopyText(chip, index))}</ChipWrapper>
                                    </Grid>
                                    <GridDivider />
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
                                            <Button disabled={isSubmitting} variant="contained" onClick={handleOpenModal}>
                                                Add template
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    handlePreviewTemplate();
                                                }}
                                                variant="contained"
                                            >
                                                Preview template
                                            </Button>
                                        </ButtonWrapper>
                                    </Grid>
                                </Grid>
                                <EmailTemplatePreviewDialog fullWidth maxWidth="sm" open={openDialog} onClose={handleDialogClose}>
                                    {openDialog && <Box dangerouslySetInnerHTML={{ __html: templateData?.readEmailTemplate?.template }} />}
                                </EmailTemplatePreviewDialog>
                            </MainCard>
                            <ConfirmModal
                                title="Create Template"
                                content="Are you sure you want to create email template ?"
                                yes={handleSubmitExternally}
                                buttonLabelYes="Yes"
                                buttonLabelNo="No"
                            />
                        </form>
                    );
                }}
            </Formik>
        </>
    );
};
export default MockComponent;
