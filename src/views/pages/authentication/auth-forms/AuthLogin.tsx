import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import Snackbar from 'ui-component/extended/Snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import useGQL from '../hooks/useGQL';
import { useDispatch } from 'react-redux';
import { setLoginState } from 'store/slices/auth';
import { openSnackbar } from 'store/slices/snackbar';
import useConfig from 'hooks/useConfig';
import { ThemeMode } from 'types/config';
import { FormattedMessage } from 'react-intl';
import { setSettings } from 'store/slices/settings';
import { ApolloError } from '@apollo/client';

// ============================|| FIREBASE - LOGIN ||============================ //

const EmailPasswordLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
    const theme = useTheme();
    const { mode, onChangeMode } = useConfig();
    const dispatch = useDispatch();

    const { ADMIN_LOGIN } = useGQL();

    const [handleLogin, { error, loading, data }] = ADMIN_LOGIN();
    const navigate = useNavigate();
    console.log('data>admin', data);
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    const [password, setPassword] = React.useState('');

    useEffect(() => {
        if (data?.login) {
            if (data?.login?.admin?.enabled2FA) {
                dispatch(
                    setLoginState({
                        isLoggedIn: true,
                        accessToken: data.login.accessToken,
                        refreshToken: data.login.refreshToken,
                        user: data.login.admin,
                        isBrowserVerified: false
                    })
                );
                navigate('/auth-code-verification', {
                    replace: true,
                    state: {
                        password
                    }
                });
            } else {
                /* maintain auth state */
                localStorage.setItem('accessToken', data.login.accessToken);

                localStorage.setItem('refreshToken', data.login.refreshToken);
                localStorage.setItem('isLoggedIn', 'true');

                dispatch(
                    setLoginState({
                        isLoggedIn: true,
                        accessToken: data.login.accessToken,
                        refreshToken: data.login.refreshToken,
                        user: data.login.admin,
                        isBrowserVerified: true
                    })
                );
                data?.login?.admin?.role === 'EDITOR'
                    ? navigate('/preset-template/list', { replace: true })
                    : navigate('/dashboard', { replace: true });
            }
        }
    }, [loading, error, data, navigate, dispatch]);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return (
        <>
            {error && <Snackbar />}
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                    // submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .matches(emailRegex, 'Enter a valid email address')
                        .max(255)
                        .required('Email is a required field')
                        .label('Email'),
                    password: Yup.string().max(255).required().label('Password')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    const browserDetail = window.navigator.userAgent;
                    try {
                        await handleLogin({
                            variables: { input: { email: values.email, password: values.password, browser: browserDetail } }
                        });
                        setStatus({ success: true });
                        setSubmitting(false);
                    } catch (err) {
                        const error = err as ApolloError;

                        const errorMsg =
                            error?.graphQLErrors?.[0]?.message ||
                            error?.networkError?.message ||
                            error?.message ||
                            'Something went wrong while resending OTP.';

                        dispatch(setLoginState({ isLoggedIn: false, isBrowserVerified: false }));
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: errorMsg,
                                anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                }
                            })
                        );
                        setStatus({ success: false });
                        // setErrors({ submit: (err as Error).message });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
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
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                autoComplete="on"
                                placeholder="Password"
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <Typography variant="subtitle1" component={Link} to="/forgot" color="primary" sx={{ textDecoration: 'none' }}>
                                Forgot Password?
                            </Typography>
                        </Stack>
                        <Box sx={{ mt: 3 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        setPassword(values?.password);
                                    }}
                                >
                                    Sign in now
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default EmailPasswordLogin;
