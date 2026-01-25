import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
// import {
//     Box,
//     Button,
//     FormControl,
//     FormHelperText,
//     Grid,
//     IconButton,
//     InputAdornment,
//     InputLabel,
//     OutlinedInput,
//     Typography
// } from '@mui/material';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { StringColorProps } from 'types';
import useGQL from '../hooks/useGQL';
import Snackbar from 'ui-component/extended/Snackbar';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ResetPasswordSuccess from '../pages/ResetPasswordSuccess';

// ========================|| FIREBASE - RESET PASSWORD ||======================== //

type ParamType = {
    userId: string;
    token: string;
};

const AppUserResetPassword = ({ ...others }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const userId = searchParams.get('userId');

    const token = searchParams.get('token');

    const { APP_USER_RESET_PASS } = useGQL();
    const [handleResetPassword, { error, loading, data }] = APP_USER_RESET_PASS();

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState<StringColorProps>();
    const [successMessage, setSuccessMessage] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    const changePassword = (value: string) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        if (data?.appUserResetPassword) {
            setSuccessMessage(true);
        }
    }, [data]);

    if (successMessage) {
        return <ResetPasswordSuccess />;
    }

    return (
        <>
            {(error || data) && <Snackbar />}
            <Formik
                initialValues={{
                    password: '',
                    confirmPassword: ''
                }}
                validationSchema={Yup.object().shape({
                    password: Yup.string()
                        .min(8, 'Password must be at least 8 characters long')
                        .matches(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                        )
                        .required('Password is required'),
                    confirmPassword: Yup.string()
                        .required('Confirm password is required')
                        .when('password', {
                            is: (val: string) => !!(val && val.length > 0),
                            then: () => Yup.string().oneOf([Yup.ref('password')], 'Both Password must be match!')
                        })
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        await handleResetPassword({
                            variables: {
                                input: {
                                    userId,
                                    token,
                                    password: values.password
                                }
                            }
                        });
                    } catch (err) {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: 'Password reset failed. Please try again!',
                                anchorOrigin: {  vertical:'bottom', horizontal: 'center' },
                                variant: 'alert',
                                alert: {
                                    color: 'error'
                                }
                            })
                        );
                        setStatus({ success: false });
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-reset">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-reset"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
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
                                inputProps={{}}
                            />
                        </FormControl>
                        {touched.password && errors.password && (
                            <FormControl fullWidth>
                                <FormHelperText error id="standard-weight-helper-text-reset">
                                    {errors.password}
                                </FormHelperText>
                            </FormControl>
                        )}
                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{
                                                    width: 85,
                                                    height: 8,
                                                    borderRadius: '7px'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}

                        <FormControl
                            fullWidth
                            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={values.confirmPassword}
                                name="confirmPassword"
                                label="Confirm Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                            />
                        </FormControl>

                        {touched.confirmPassword && errors.confirmPassword && (
                            <FormControl fullWidth>
                                <FormHelperText error id="standard-weight-helper-text-confirm-password">
                                    {' '}
                                    {errors.confirmPassword}{' '}
                                </FormHelperText>
                            </FormControl>
                        )}

                        <Box
                            sx={{
                                mt: 1
                            }}
                        >
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Reset Password
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AppUserResetPassword;
