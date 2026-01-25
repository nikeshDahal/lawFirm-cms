// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import useGQL from '../hooks/useGQL';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router-dom';
import { checkMail } from 'constants/routePaths';

// ========================|| FIREBASE - FORGOT PASSWORD ||======================== //

const AuthForgotPassword = ({ ...others }) => {
    const theme = useTheme();
    const { FORGOT_PASS } = useGQL();
    const dispatch = useDispatch();
    const [handleForgotPass, { error, data }] = FORGOT_PASS();
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.forgotPassword) {
            navigate(checkMail);
            dispatch(
                openSnackbar({
                    open: true,
                    message: data.forgotPassword.message,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                })
            );
        }
        if (error?.message) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: error?.message,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                })
            );
        }
    }, [data, error, dispatch]);

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email address is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        await handleForgotPass({
                            variables: {
                                input: {
                                    email: values.email
                                }
                            }
                        });
                    } catch (err) {
                        setStatus({ success: false });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-forgot">Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-forgot"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email"
                                inputProps={{}}
                                placeholder="Enter your email"
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-forgot">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Please send me the link!
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthForgotPassword;
