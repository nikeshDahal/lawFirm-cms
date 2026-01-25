// material-ui
import { Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, Stack, TextField } from '@mui/material';

// project imports
import { Formik } from 'formik';
import AlertDialog from 'components/dialog/AlertDialog';
import { useAlertDialog } from './hooks';
import { useGQL } from './hooks/useGQL';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useEffect, useState } from 'react';
import { RootState } from 'store';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { initialValuesChangePassword, validationSchemaChangePassword } from './constant/constant';
import CustomLoader from 'components/loader';
import RightAlignedWrapper from 'ui-component/buttonWrapper';

// ==============================|| PROFILE 2 - CHANGE PASSWORD ||============================== //

const ChangePassword = () => {
    const [submitValues, setSubmitValues] = useState({ password: '', oldPassword: '' });
    const { alertDialog, handleAlertDialogOpen, handleAlertDialogClose } = useAlertDialog();
    const { ADMIN_CHANGE_PASSWORD, GET_ADMIN_PROFILE } = useGQL();
    const [changePassword, { loading, data }] = ADMIN_CHANGE_PASSWORD();
    const { loading: adminProfileLoading } = GET_ADMIN_PROFILE();
    const { open } = useSelector((state: RootState) => state.snackbar);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const handleClickShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
    const handleMouseDownCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
    useEffect(() => {
        if (data?.changePassword) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: data.changePassword?.message,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                })
            );
        }
    }, [loading, data]);

    const handleChangePassword = async () => {
        try {
            await changePassword({
                variables: {
                    input: submitValues
                }
            });
            localStorage.clear();
            navigate('/login');
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

    const handleConfirmChangePassword = (values, setSubmitting) => {
        handleAlertDialogOpen();
        setSubmitValues({
            password: values.password,
            oldPassword: values.current
        });
        setSubmitting(false);
    };

    if (loading || adminProfileLoading) {
        return <CustomLoader />;
    }

    return (
        <>
            <AlertDialog
                {...{
                    open: alertDialog,
                    title: 'Change Password',
                    description: 'You are about to change your password?',
                    handleAlertDialogClose,
                    handleMutation: handleChangePassword
                }}
            />
            <Formik
                initialValues={initialValuesChangePassword}
                validationSchema={validationSchemaChangePassword}
                onSubmit={(values, { setSubmitting }) => handleConfirmChangePassword(values, setSubmitting)}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <InputLabel>Old password</InputLabel>
                                <TextField
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    fullWidth
                                    name="current"
                                    value={values.current}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Old password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowCurrentPassword}
                                                    onMouseDown={handleMouseDownCurrentPassword}
                                                >
                                                    {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                {touched.current && errors.current && (
                                    <FormHelperText error id="name-error">
                                        {errors.current}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid container item xs={12} spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>New password</InputLabel>
                                    <TextField
                                        fullWidth
                                        value={values.password}
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="New password"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="name-error">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Repeat new password</InputLabel>
                                    <TextField
                                        fullWidth
                                        value={values.passwordConfirm}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="passwordConfirm"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Repeat password"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowConfirmPassword}
                                                        onMouseDown={handleMouseDownConfirmPassword}
                                                    >
                                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    {touched.passwordConfirm && errors.passwordConfirm && (
                                        <FormHelperText error id="name-error">
                                            {errors.passwordConfirm}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                                <Stack className="button-wrapper-row">
                                    <Button variant="contained" size="large" type="submit" disabled={isSubmitting}>
                                        Change password
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};
export default ChangePassword;
