import { useEffect, useState } from 'react';
// material-ui
import { Grid, TextField, FormHelperText, MenuItem, Button, Paper, Stack, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import useGQL from '../hooks/useGQL';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Snackbar from 'ui-component/extended/Snackbar';
import { RootState } from 'store';
import { RegisterType, userRole as role } from '../constants/types';
import { firstLetterUppercase } from 'utils/commonHelpers';
import { status, validationSchemaAddAdmin } from '../constants/variables';
import PageTitle from 'components/page-title/PageTitle';
import CustomLoader from 'components/loader';
import { AdminStatus } from 'store/constant';
import RightAlignedWrapper from 'ui-component/buttonWrapper';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

const AdminAddForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { open } = useSelector((state: RootState) => state.snackbar);
    const [initialValues] = useState<RegisterType>({ firstName: '', lastName: '', email: '', phone: '', role: 'ADMIN', status: 'ACTIVE' });
    const [pageLoading, setPageLoading] = useState(false);
    const { ADMIN_REGISTER } = useGQL();

    const [handleRegister, { loading, data }] = ADMIN_REGISTER();

    useEffect(() => {
        if (data?.register) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: data?.register?.message || `Admin created successfully!`,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                })
            );
            setTimeout(() => {
                navigate('/admin/list');
            }, 2000);
        }
    }, [loading, data]);
    if (pageLoading) {
        return <CustomLoader />;
    }

    const handleAddAdmin = async (values, setSubmitting) => {
        try {
            await handleRegister({
                variables: {
                    input: {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        phone: values.phone.toString(),
                        role: values.role,
                        status: AdminStatus.ACTIVE
                    }
                }
            });
            setSubmitting(false);
            setPageLoading(true);
        } catch (err: any) {
            setPageLoading(false);
            dispatch(
                openSnackbar({
                    open: true,
                    message: err?.message,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                })
            );

            setSubmitting(false);
        }
    };
    const breadcrumbLinks = [
        { title: 'Admin management', to: '/admin/list' },
        {
            title: 'Add new admin'
        }
    ];
    return (
        <>
            <Stack className="custom-breadcrumb">
                <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
            </Stack>
            {open && <Snackbar />}
            <PageTitle title="Add new admin" />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchemaAddAdmin}
                onSubmit={(values, { setSubmitting }) => handleAddAdmin(values, setSubmitting)}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <MainCard>
                            <Typography variant="h3" mb={{ xs: 2, md: 3 }}>
                                Account details
                            </Typography>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>First name</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="First name"
                                        value={values.firstName}
                                        name="firstName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.firstName && errors.firstName && (
                                        <FormHelperText error id="firstName-error">
                                            {firstLetterUppercase(errors.firstName)}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Last name</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Last name"
                                        value={values.lastName}
                                        name="lastName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.lastName && errors.lastName && (
                                        <FormHelperText error id="lastName-error">
                                            {firstLetterUppercase(errors.lastName)}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Email</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Your email address"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="email-error">
                                            {firstLetterUppercase(errors.email)}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Contact</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Your phone number"
                                        value={values.phone}
                                        name="phone"
                                        type="text"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.phone && errors.phone && (
                                        <FormHelperText error id="phone-error">
                                            {firstLetterUppercase(errors.phone)}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Role</InputLabel>
                                    <TextField
                                        placeholder="Role"
                                        id="admin-role"
                                        name="role"
                                        select
                                        value={values.role}
                                        fullWidth
                                        onChange={handleChange}
                                    >
                                        {role.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    {touched.role && errors.role && (
                                        <FormHelperText error id="role-error">
                                            {firstLetterUppercase(errors.role)}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                        </MainCard>
                        <Paper className="form-button-wrapper">
                            <Stack>
                                <RightAlignedWrapper>
                                    <Button disabled={isSubmitting} type="submit" variant="contained" color="primary" size="large">
                                        Create new user
                                    </Button>
                                </RightAlignedWrapper>
                            </Stack>
                        </Paper>
                    </form>
                )}
            </Formik>
        </>
    );
};
export default AdminAddForm;
