import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useGQL } from '../hooks/useGQL';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginState } from 'store/slices/auth';
import { Button, Box, TextField, Grid, Typography, FormHelperText, ListItem, ListItemText } from '@mui/material';
import { openSnackbar } from 'store/slices/snackbar';
import { TwoFactorAuthProps, configurationList, initialValuesOtp, validationSchemaOtp } from '../constant/constant';
import { MetaButtonWrapper, UnorderList } from '../profile.styles';

export default function TwoFactorAuth({ otpAuthUrl, base32, closeModal }: TwoFactorAuthProps) {
    const dispatch = useDispatch();
    const [qrcodeUrl, setqrCodeUrl] = useState<string>('');
    const { VERIFY_AUTH_OTP } = useGQL();
    const [verifyOtp] = VERIFY_AUTH_OTP();
    const auth = useSelector((state: any) => state.auth);

    useEffect(() => {
        QRCode.toDataURL(otpAuthUrl).then(setqrCodeUrl);
    }, [otpAuthUrl]);

    const handleTwoFactorAuthentication = async (values) => {
        try {
            const resp = await verifyOtp({
                variables: {
                    token: values.token
                }
            });
            if (resp.data?.verifyAuthOTP) {
                const authUser = { ...auth.user, enabled2FA: true };
                dispatch(
                    setLoginState({
                        isLoggedIn: auth.isLoggedIn,
                        accessToken: auth.accessToken,
                        refreshToken: auth.refreshToken,
                        isBrowserVerified: auth.isBrowserVerified,
                        user: authUser,
                        otpExpiresAt: auth.otpExpiresAt
                    })
                );
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'OTP Authenticator set successfully',
                        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        }
                    })
                );
                closeModal();
            }
        } catch (err: any) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: err.message,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                })
            );
        }
    };

    return (
        <>
            <Typography sx={{ marginTop: 6 }} variant="h3">
                Two-Factor Authentication (2FA)
            </Typography>
            <Typography variant="h4" my={2}>
                Configuring OTP Authenticator
            </Typography>
            <UnorderList>
                {configurationList.map((item) => (
                    <ListItem>
                        <ListItemText disableTypography primary={item} />
                    </ListItem>
                ))}
            </UnorderList>
            {/* <Typography variant="h4" mt={2}>
                Scan QR Code
            </Typography>
            <Box>
                <img src={qrcodeUrl} alt="qrcode url" />
            </Box> */}
            {/* <Box my={2}>
                <Typography variant="h4">Verify Code</Typography>
                <Typography>For changing the setting, please verify the authentication code:</Typography>
            </Box> */}
            <Formik
                initialValues={initialValuesOtp}
                validationSchema={validationSchemaOtp}
                onSubmit={(values) => handleTwoFactorAuthentication(values)}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid sx={{ marginTop: 2 }} item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    placeholder="Authentication Code"
                                    value={values.token}
                                    name="token"
                                    label="Authentication Code"
                                    onChange={handleChange}
                                />
                                {touched.token && errors.token && (
                                    <FormHelperText error id="standard-weight-helper-text--register">
                                        {errors.token}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <MetaButtonWrapper item xs={12}>
                                <Button variant="outlined" size="large" onClick={closeModal}>
                                    Close
                                </Button>
                                <Button variant="outlined" size="large" type="submit" disabled={isSubmitting}>
                                    Verify & Activate
                                </Button>
                            </MetaButtonWrapper>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
}
