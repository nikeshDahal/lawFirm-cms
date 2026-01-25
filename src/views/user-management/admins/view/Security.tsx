// material-ui
import { Button, TextField, Typography } from '@mui/material';

// project imports
import { Box } from '@mui/system';
import { Formik } from 'formik';
import * as Yup from 'yup';

import useGQL from '../hooks/useGQL';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import FailureLoad from 'components/spinner/fail';
import CustomLoader from 'components/loader';
import RightAlignedWrapper from 'ui-component/buttonWrapper';
// ==============================|| SECURITY ||============================== //

const Security = ({ adminId, data, loading, error }) => {
    const { SEND_ADMIN_PASSWORD_RESET_MAIL } = useGQL();
    const [handleMail] = SEND_ADMIN_PASSWORD_RESET_MAIL();

    const handleMailSend = async (values) => {
        try {
            const response = await handleMail({
                variables: {
                    userId: adminId,
                    name:
                        data?.getAdmin?.admin?.firstName && data?.getAdmin?.admin?.lastName
                            ? data?.getAdmin.admin?.firstName + data?.getAdmin.admin?.lastName
                            : values.authProviderId,
                    email: values.authProviderId
                }
            });
            dispatch(
                openSnackbar({
                    open: true,
                    message: response?.data?.sendAdminPasswordResetMail,
                    variant: 'alert',
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    alert: {
                        color: 'success'
                    }
                })
            );
        } catch (error: any) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: error?.graphQLErrors[0]?.extensions?.response?.message || error?.message,
                    variant: 'alert',
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    alert: {
                        color: 'error'
                    }
                })
            );
        }
    };
    if (loading || !data?.getAdmin.admin) {
        return <CustomLoader />;
    }

    if (error) {
        return <FailureLoad />;
    }

    return (
        <>
            <Typography variant="h3" sx={{ mb: '0.5em' }}>
                Send reset password link
            </Typography>
            <Formik
                enableReinitialize
                initialValues={{ authProviderId: data?.getAdmin?.admin?.email || '' }}
                validationSchema={Yup.object().shape({
                    authProviderId: Yup.string().email('Email Address format is not match').required('').label('Email Address')
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    handleMailSend(values);
                    setSubmitting(false);
                }}
            >
                {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <Typography variant="body2">Email</Typography>
                            <TextField
                                type="text"
                                id="authProviderId"
                                value={values.authProviderId}
                                placeholder="Email"
                                fullWidth
                                variant="outlined"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled
                            />
                            <Box sx={{ mt: '1em' }}>
                                <RightAlignedWrapper>
                                    <Button disabled={isSubmitting} type="submit" variant="contained" color="primary">
                                        Send Link
                                    </Button>
                                </RightAlignedWrapper>
                            </Box>
                        </form>
                    );
                }}
            </Formik>
        </>
    );
};

export default Security;
