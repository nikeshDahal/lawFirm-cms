import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, CircularProgress, Divider, FormHelperText, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from 'views/pages/AuthWrapper1';
import AuthCardWrapper from 'views/pages/AuthCardWrapper';
import Logo from 'ui-component/Logo';
import { useDispatch, useSelector } from 'react-redux';
// import OtpInput from 'react-otp-input-rc-17';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { openSnackbar } from 'store/slices/snackbar';
import { useEffect, useState } from 'react';
import useGQL from '../hooks/useGQL';
import { setLoginState } from 'store/slices/auth';
import OtpInput from 'react18-input-otp';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import { GridDivider } from 'components/divider/Divider';
import { useLocation } from 'react-router-dom';
import { ApolloError } from '@apollo/client';

// assets

// ===========================|| AUTH3 - CODE VERIFICATION ||=========================== //

const AuthOtpVerification = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const userDetails = useSelector((state: any) => state.auth.user);
    const [otp, setOtp] = useState();
    const dispatch = useDispatch();
    const borderColor = theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[300];
    const { VALIDATE_AUTH_OTP, RESEND_CODE } = useGQL();
    const [validateOtp, { loading: validateOtpLoading }] = VALIDATE_AUTH_OTP();
    const [resendCode, { loading: resendCodeLoading, error: resendCodeError, data: resendCodeData }] = RESEND_CODE();
    const [timeLeft, setTimeLeft] = useState(120); // Initial timer set to 2 minutes
    const [resendEnabled, setResendEnabled] = useState(false);
    const location = useLocation();
    const password = location.state?.password;

    useEffect(() => {
        if (timeLeft <= 0) {
            setResendEnabled(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleResendOtp = async () => {
        const browserDetail = window.navigator.userAgent;
        const email = userDetails?.email;

        try {
            const response = await resendCode({
                variables: {
                    input: {
                        password,
                        email,
                        browser: browserDetail
                    }
                }
            });
            console.log('response.data?.resendEmailOtp?', response.data?.resendEmailOtp);
            const expiresAt = new Date(response.data?.resendEmailOtp?.expiresAt).getTime();
            const now = new Date().getTime();
            const newTimeLeft = Math.floor((expiresAt - now) / 1000);

            setTimeLeft(newTimeLeft > 0 ? newTimeLeft : 0);
            setResendEnabled(false);
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'OTP code send successfully',
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                })
            );
        } catch (err) {
            const error = err as ApolloError;

            const errorMsg =
                error?.graphQLErrors?.[0]?.message ||
                error?.networkError?.message ||
                error?.message ||
                'Something went wrong while resending OTP.';

            dispatch(
                openSnackbar({
                    open: true,
                    message: errorMsg,
                    anchorOrigin: { vertical: 'buttom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                })
            );
        }
    };

    return (
        <AuthWrapper1>
            <Grid container justifyContent={{ xs: 'center', md: 'space-between' }} alignItems="center" sx={{ minHeight: '100vh' }}>
                <Grid md={6} lg={7} xs={12} sx={{ minHeight: '100vh' }}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Link to="#">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={2}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                        textAlign="center"
                                                    >
                                                        Two-Factor Authentication
                                                    </Typography>

                                                    <Typography variant="subtitle2" fontSize="1rem" textAlign="center">
                                                        Your account is protected with Two-Factor Authentication (2FA).
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        fontSize="0.9rem"
                                                        textAlign="center"
                                                        color="textSecondary"
                                                        px={2}
                                                    >
                                                        To complete the sign-in process, enter the 6-digit verification code sent to your
                                                        registered email address. This extra step ensures your account remains secure.
                                                    </Typography>

                                                    <Divider sx={{ width: '60%', mt: 1, mb: 1 }} />

                                                    <Typography variant="subtitle1" fontSize="1rem" fontWeight={500} textAlign="center">
                                                        Enter Verification Code
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Formik
                                        initialValues={{
                                            otp: otp,
                                            email: userDetails?.email
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={Yup.object().shape({
                                            otp: Yup.string().required('Code is required').min(6, 'Requires 6 digits')
                                        })}
                                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                            const browserDetail = window.navigator.userAgent;

                                            try {
                                                const response = await validateOtp({
                                                    variables: {
                                                        otp: values.otp,
                                                        input: {
                                                            password,
                                                            email: values.email,
                                                            browser: browserDetail
                                                        }
                                                    }
                                                });

                                                const { accessToken, refreshToken, admin } = response.data?.validateOTP || {};

                                                if (accessToken) {
                                                    localStorage.setItem('accessToken', accessToken);
                                                    localStorage.setItem('refreshToken', refreshToken);
                                                    dispatch(
                                                        setLoginState({
                                                            isLoggedIn: true,
                                                            accessToken,
                                                            refreshToken,
                                                            user: admin,
                                                            isBrowserVerified: true
                                                        })
                                                    );

                                                    navigate(admin?.role === 'EDITOR' ? '/preset-template/list' : '/dashboard', {
                                                        replace: true
                                                    });
                                                }
                                            } catch (err: any) {
                                                console.error('OTP Verification Error:', err);

                                                const defaultError = 'OTP verification failed. Please try again.';
                                                let extractedMessage = defaultError;

                                                // Extract custom error message from GraphQL error response
                                                if (err?.graphQLErrors?.[0]?.extensions?.response?.message) {
                                                    const errorMsg = err.graphQLErrors[0].extensions.response.message;
                                                    extractedMessage = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
                                                }

                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: extractedMessage,
                                                        anchorOrigin: { horizontal: 'center', vertical: 'buttom' },
                                                        variant: 'alert',
                                                        alert: { color: 'error' }
                                                    })
                                                );

                                                setStatus({ success: false });
                                                setSubmitting(false);
                                            }
                                        }}
                                    >
                                        {({
                                            errors,
                                            handleBlur,
                                            handleChange,
                                            handleSubmit,
                                            setFieldValue,
                                            isSubmitting,
                                            touched,
                                            values
                                        }) => (
                                            <form noValidate onSubmit={handleSubmit}>
                                                <Grid container spacing={3}>
                                                    <Grid
                                                        sx={{
                                                            'input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button':
                                                                {
                                                                    // WebkitAppearance: 'none',
                                                                    appearance: 'none'
                                                                }
                                                        }}
                                                        item
                                                        xs={12}
                                                    >
                                                        <OtpInput
                                                            inputProps={{ type: 'number' }}
                                                            value={values.otp}
                                                            onChange={(otpNumber) => setFieldValue('otp', otpNumber, false)}
                                                            numInputs={6}
                                                            containerStyle={{ justifyContent: 'space-between' }}
                                                            inputStyle={{
                                                                width: '100%',
                                                                margin: '8px',
                                                                padding: '10px',
                                                                border: `1px solid ${borderColor}`,
                                                                borderRadius: 4,
                                                                ':hover': {
                                                                    borderColor: theme.palette.primary.main
                                                                }
                                                            }}
                                                            focusStyle={{
                                                                outline: 'none',
                                                                border: `2px solid ${theme.palette.primary.main}`
                                                            }}
                                                            shouldAutoFocus
                                                        />
                                                        {touched.otp && errors.otp && (
                                                            <FormHelperText error id="standard-weight-helper-text--register">
                                                                {errors.otp}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Button disableElevation fullWidth size="large" type="submit" variant="contained">
                                                            Continue
                                                        </Button>
                                                    </Grid>
                                                    <GridDivider />
                                                    <Grid item xs={12}>
                                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                                            <Typography variant="body2" align="center">
                                                                {resendEnabled
                                                                    ? "Didn't receive the code?"
                                                                    : `You can resend the code in ${Math.floor(timeLeft / 60)
                                                                          .toString()
                                                                          .padStart(
                                                                              2,
                                                                              '0'
                                                                          )}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                                                            </Typography>
                                                            <Button
                                                                variant="text"
                                                                color="primary"
                                                                onClick={handleResendOtp}
                                                                disabled={!resendEnabled}
                                                            >
                                                                Resend Code
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Grid container item direction="row-reverse" alignItems="center" xs={12}>
                                                            {/* <Grid xs={6} /> */}
                                                            <Grid item xs={6}>
                                                                <Typography
                                                                    component={Link}
                                                                    to="/login"
                                                                    variant="subtitle1"
                                                                    sx={{
                                                                        textDecoration: 'none',
                                                                        display: 'flex',
                                                                        justifyContent: 'flex-end'
                                                                    }}
                                                                >
                                                                    Back to Login ?
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </form>
                                        )}
                                    </Formik>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
                    <BackgroundPattern2>
                        <></>
                    </BackgroundPattern2>
                </Grid>
            </Grid>
            {(resendCodeLoading || validateOtpLoading) && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="rgba(255, 255, 255, 0.7)"
                    zIndex={10}
                >
                    <CircularProgress />
                </Box>
            )}
        </AuthWrapper1>
    );
};

export default AuthOtpVerification;
