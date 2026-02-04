import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

// material-ui
import {
    Button,
    Grid,
    Stack,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Card,
    CardContent,
    Box
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { FaqPath } from 'routes/PageManagementRoutes';
import { PageStatusEnum } from './constants/faq-management-enum';
import { FaqItem, FaqPage } from './types';
import { useGQL } from './hooks/useGQL';
import useSnackbar from './hooks/useSnackbar';
import CustomLoader from 'components/loader';
import { useSelector } from 'store';
import Error from 'views/pages/maintenance/Error';

// validation schema
const validationSchema = Yup.object().shape({
    items: Yup.array()
        .of(
            Yup.object().shape({
                question: Yup.string().required('Question is required'),
                answer: Yup.string().required('Answer is required'),
                status: Yup.string().required('Status is required')
            })
        )
        .min(1, 'At least one FAQ item is required')
});

// ==============================|| FAQ ADD/EDIT FORM ||============================== //

const FaqForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { handleOpenSnackbar } = useSnackbar();

    const { CREATE_FAQ, UPDATE_FAQ, GET_FAQS_LIST } = useGQL();
    const [createFaq] = CREATE_FAQ();
    const [updateFaq] = UPDATE_FAQ();
    const { loading: faqLoading, data: faqData, refetch } = GET_FAQS_LIST();

    const [initialValues, setInitialValues] = useState<FaqPage>({
        items: []
    });

    useEffect(() => {
        if (isEdit && faqData?.findAllfaqs?.page) {
            setInitialValues({
                items: (faqData.findAllfaqs.page.items || []).map((item) => ({
                    ...item,
                    status: item.status?.toUpperCase() || PageStatusEnum.ACTIVE
                }))
            });
        } else if (!isEdit) {
            // For add mode, start with one empty item
            setInitialValues({
                items: [
                    {
                        question: '',
                        answer: '',
                        status: PageStatusEnum.ACTIVE
                    }
                ]
            });
        }
    }, [faqData, isEdit]);

    const handleSubmit = async (values: FaqPage, { setSubmitting }: any) => {
        try {
            const input = {
                items: values.items
            };

            if (isEdit) {
                await createFaq({
                    variables: {
                        body: input
                    }
                });
                refetch();
                handleOpenSnackbar({ message: 'FAQ updated successfully', alertType: 'success' });
            } else {
                await createFaq({
                    variables: { body: input }
                });
                refetch();
                handleOpenSnackbar({ message: 'FAQ created successfully', alertType: 'success' });
            }

            navigate(`${FaqPath}/manage`, { state: { refetch: true } });
        } catch (error) {
            handleOpenSnackbar({ message: `Error ${isEdit ? 'updating' : 'creating'} FAQ`, alertType: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const user = useSelector((state: any) => state.auth.user);

    if (user?.role === 'EDITOR') {
        return <Error />;
    }

    // if (faqLoading) {
    //     return <CustomLoader />;
    // }

    return (
        <MainCard>
            <Typography variant="h2" gutterBottom>
                {isEdit ? 'Edit FAQ' : 'Add FAQ'}
            </Typography>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
                    <Form>
                        <Grid container spacing={3}>
                            {/* FAQ Items */}
                            <Grid item xs={12}>
                                <Typography sx={{ mb: 2, mt: 2 }} variant="h4" gutterBottom>
                                    Frequently Asked Questions(FAQ) Items
                                </Typography>

                                <FieldArray name="items">
                                    {({ push, remove }) => (
                                        <>
                                            {values.items.map((item, index) => (
                                                <Card key={index} sx={{ mb: 2 }}>
                                                    <CardContent>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="h4">Item {index + 1}</Typography>
                                                            </Grid>

                                                            <Grid item xs={12} md={6}>
                                                                <FormControl fullWidth>
                                                                    <InputLabel>Status</InputLabel>
                                                                    <Select
                                                                        name={`items.${index}.status`}
                                                                        value={item.status}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        error={
                                                                            touched.items?.[index]?.status &&
                                                                            Boolean((errors.items as any)?.[index]?.status)
                                                                        }
                                                                    >
                                                                        <MenuItem value={PageStatusEnum.ACTIVE}>Active</MenuItem>
                                                                        <MenuItem value={PageStatusEnum.INACTIVE}>Inactive</MenuItem>
                                                                    </Select>
                                                                    {touched.items?.[index]?.status &&
                                                                        (errors.items as any)?.[index]?.status && (
                                                                            <Typography
                                                                                variant="caption"
                                                                                color="error"
                                                                                sx={{ mt: 1, ml: 2 }}
                                                                            >
                                                                                {(errors.items as any)[index].status}
                                                                            </Typography>
                                                                        )}
                                                                </FormControl>
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <InputLabel>Question</InputLabel>
                                                                <TextField
                                                                    fullWidth
                                                                    name={`items.${index}.question`}
                                                                    value={item.question}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    multiline
                                                                    rows={4}
                                                                    error={
                                                                        touched.items?.[index]?.question &&
                                                                        Boolean((errors.items as any)?.[index]?.question)
                                                                    }
                                                                    helperText={
                                                                        touched.items?.[index]?.question &&
                                                                        (errors.items as any)?.[index]?.question
                                                                    }
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <InputLabel>Answer</InputLabel>
                                                                <TextField
                                                                    fullWidth
                                                                    multiline
                                                                    rows={4}
                                                                    name={`items.${index}.answer`}
                                                                    value={item.answer}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    error={
                                                                        touched.items?.[index]?.answer &&
                                                                        Boolean((errors.items as any)?.[index]?.answer)
                                                                    }
                                                                    helperText={
                                                                        touched.items?.[index]?.answer &&
                                                                        (errors.items as any)?.[index]?.answer
                                                                    }
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12}>
                                                                <Box display="flex" justifyContent="flex-end">
                                                                    <IconButton
                                                                        color="error"
                                                                        onClick={() => remove(index)}
                                                                        disabled={values.items.length === 1}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="outlined"
                                                startIcon={<AddIcon />}
                                                onClick={() =>
                                                    push({
                                                        question: '',
                                                        answer: '',
                                                        status: PageStatusEnum.ACTIVE
                                                    })
                                                }
                                                sx={{ mt: 2 }}
                                            >
                                                Add FAQ Item
                                            </Button>
                                        </>
                                    )}
                                </FieldArray>
                            </Grid>

                            {/* Submit Buttons */}
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={2} justifyContent="flex-end">
                                    <AnimateButton>
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            onClick={() => navigate(`${FaqPath}/manage`)}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                    </AnimateButton>
                                    <AnimateButton>
                                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                                            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                                        </Button>
                                    </AnimateButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </MainCard>
    );
};

export default FaqForm;
