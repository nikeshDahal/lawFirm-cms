// material-ui
import { Box, FormControlLabel, Switch, Typography, CircularProgress } from '@mui/material';

// project imports
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { setLoginState } from 'store/slices/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGQL } from './hooks/useGQL';

const OtpAuthenticator = () => {
    const { GET_OTP_AUTH_URL, UPDATE2FA } = useGQL();
    const [skip] = useState<boolean>(true);
    const { refetch } = GET_OTP_AUTH_URL(skip);
    const auth = useSelector((state: any) => state.auth);
    const [update2FA, { loading }] = UPDATE2FA();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isToggle, setIsToggle] = useState<boolean>(auth?.user?.enabled2FA || false);

    useEffect(() => {
        setIsToggle(auth?.user?.enabled2FA);
    }, [auth?.user?.enabled2FA]);

    const handleToggle2FA = async (checked: boolean) => {
        setIsToggle(checked);
        try {
            const { data } = await update2FA({
                variables: {
                    status: checked
                }
            });

            if (data?.update2FA?.message) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: checked ? 'Two-Factor Authentication has been enabled.' : 'Two-Factor Authentication has been disabled.',
                        variant: 'alert',
                        alert: { color: 'success' },
                        close: true
                    })
                );

                if (checked) {
                    // Wait 2 seconds before logout if 2FA is enabled
                    setTimeout(() => {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('isBrowserVerified');

                        dispatch(
                            setLoginState({
                                isLoggedIn: false,
                                isBrowserVerified: false
                            })
                        );

                        navigate('/login', { replace: true });
                    }, 3000);
                }
            }
        } catch (err) {
            setIsToggle((prev) => !prev);
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Failed to update Two-Factor Authentication.',
                    variant: 'alert',
                    alert: { color: 'error' },
                    close: true
                })
            );
        }
    };

    return (
        <>
            <Box display="flex" alignItems="center" gap={2}>
                <FormControlLabel
                    control={<Switch checked={isToggle} onChange={(e) => handleToggle2FA(e.target.checked)} disabled={loading} />}
                    label="Enable 2FA"
                />
                {loading && <CircularProgress size={20} />}
            </Box>

            <Box mt={4}>
                <Typography variant="h6">About Two-Factor Authentication (2FA)</Typography>
                <Typography variant="body2" mt={1}>
                    Two-factor authentication adds an extra layer of security to your account. When enabled, you’ll be required to enter a
                    one-time password (OTP) sent to your registered email every time you log in.
                </Typography>
                <Typography variant="body2" mt={1}>
                    This helps protect your account even if your password is compromised.
                </Typography>
            </Box>
        </>
    );
};

export default OtpAuthenticator;
