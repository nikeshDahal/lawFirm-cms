import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, FormHelperText, Grid, Snackbar, Stack, Typography } from '@mui/material';

// import OtpInput from 'react-otp-input-rc-17';
import useGQL from '../hooks/useGQL';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { openSnackbar } from 'store/slices/snackbar';
import { setLoginState } from 'store/slices/auth';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react18-input-otp';
import { GridDivider } from 'components/divider/Divider';

// ============================|| STATIC - CODE VERIFICATION ||============================ //

const AuthCodeVerification = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const { CODE_VERIFY, RESEND_CODE } = useGQL();

    const dispatch = useDispatch();
    const [handleCodeverify, { loading, error, data }] = CODE_VERIFY();
    const [handleResendCode] = RESEND_CODE();
    const [otp, setOtp] = useState();
    const [countDownStatus, setCountDownStatus] = useState(true);
    const [expireTime, setExpireTime] = useState<any>();
    const borderColor = theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[300];
    const userDetails = useSelector((state: any) => state.auth.user);
    const expiresAt = useSelector((state: any) => state.auth.otpExpiresAt);
    const auth = useSelector((state: any) => state.auth);
    const deviceId = window.navigator.userAgent;

    const resendCodeOtp = async () => {
        try {
            const resendCodeResp = await handleResendCode({
                variables: {
                    input: {
                        email: userDetails?.email,
                        deviceId,
                        deviceType: 3,
                        deviceName: 'browser'
                    }
                }
            });
            dispatch(
                setLoginState({
                    isLoggedIn: auth.isLoggedIn,
                    accessToken: auth.accessToken,
                    refreshToken: auth.refreshToken,
                    isBrowserVerified: auth.isBrowserVerified,
                    user: auth.user,
                    otpExpiresAt: resendCodeResp?.data.resendOtpCode.expiresAt
                })
            );
            setCountDownStatus(true);
        } catch (err) {
            console.log(err);
        }
    };

    const countDownDate = new Date(expiresAt).getTime();

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Get today's date and time

            const now = new Date().getTime();

            // Find the distance between now and the count down date
            const distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setExpireTime(`${minutes}:${seconds}`);
            if (hours > 0) {
                setExpireTime(`${hours}:${minutes}:${seconds}`);
            }
            if (distance <= 0) {
                clearInterval(intervalId);
                setCountDownStatus(false);
                setExpireTime(`${0}:${0}`);
            }
        }, 1000);
        if (!countDownStatus) {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [countDownDate, countDownStatus, expiresAt]);

    return (
        <>
            {(error || data) && <Snackbar />}
            <Formik
                initialValues={{
                    otp: otp,
                    email: userDetails?.email
                }}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                    otp: Yup.string().required('Code is required').min(4, 'Requires 4 digits'),
                    email: Yup.string().required('Email is a required field')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        const codeVerifyResponse = await handleCodeverify({
                            variables: {
                                input: {
                                    email: values.email,
                                    otp: values.otp,
                                    deviceId
                                }
                            }
                        });
                        if (codeVerifyResponse.data?.otpVerificationFor2FA?.accessToken) {
                            localStorage.setItem('accessToken', codeVerifyResponse.data.otpVerificationFor2FA.accessToken);
                            localStorage.setItem('refreshToken', codeVerifyResponse.data.otpVerificationFor2FA.refreshToken);
                            dispatch(
                                setLoginState({
                                    isLoggedIn: true,
                                    accessToken: codeVerifyResponse.data.otpVerificationFor2FA.accessToken,
                                    refreshToken: codeVerifyResponse.data.otpVerificationFor2FA.refreshToken,
                                    user: codeVerifyResponse.data.otpVerificationFor2FA.admin,
                                    isBrowserVerified: true,
                                    otpExpiresAt: codeVerifyResponse.data.otpVerificationFor2FA?.expiresAt
                                })
                            );
                            navigate('/dashboard', { replace: true });
                        }
                    } catch (err: any) {
                        if (err.message === 'Invalid otp code') {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'Invalid OTP. Please try with valid OTP!',
                                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    }
                                })
                            );
                        } else {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'OTP verification failed!. Please try again!',
                                    anchorOrigin: { horizontal: 'center' },
                                    variant: 'alert',
                                    alert: {
                                        color: 'error'
                                    }
                                })
                            );
                        }
                        setStatus({ success: false });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <OtpInput
                                    value={values.otp}
                                    onChange={(otpNumber) => setFieldValue('otp', otpNumber, false)}
                                    numInputs={4}
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
                                    <Typography variant="body1" color="grey.600" sx={{ textAlign: 'center', textDecoration: 'none' }}>
                                        Didn’t receive the code
                                    </Typography>
                                    <Button
                                        disableElevation
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="text"
                                        color="primary"
                                        onClick={resendCodeOtp}
                                    >
                                        Resend Code
                                    </Button>
                                </Grid>
                            </Grid>
                            {/* To show countdown use following code */}
                            {/* <Grid item xs={12}>
                                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                                    <Typography>Did not receive the email?</Typography>
                                    {countDownStatus && <Typography>{expireTime}</Typography>}
                                    <Button
                                        variant="text"
                                        sx={{
                                            minWidth: 85,
                                            ml: 2,
                                            textDecoration: 'none',
                                            cursor: 'pointer'
                                        }}
                                        color="primary"
                                        onClick={resendCodeOtp}
                                        // disabled={countDownStatus}
                                    >
                                        Resend code
                                    </Button>
                                </Stack>
                            </Grid> */}
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};
export default AuthCodeVerification;
