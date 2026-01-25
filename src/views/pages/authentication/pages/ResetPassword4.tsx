import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import Logo from 'ui-component/Logo';
import { useDispatch } from 'react-redux';
import useGQL from '../hooks/useGQL';
import { useEffect, useState } from 'react';
import TokenExpired from './TokenExpired';
import AppUserResetPassword from '../auth-forms/AppUserResetPassword';
import AuthWrapper1 from 'views/pages/AuthWrapper1';
import AuthCardWrapper from 'views/pages/AuthCardWrapper';
import CustomLoader from 'components/loader';

// assets

// ============================|| AUTH3 - RESET PASSWORD ||============================ //
type ParamType = {
    userId: string;
    token: string;
};
const ResetPassword = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [userId, setUserId] = useState(searchParams.get('userId'));
    const [token, setToken] = useState(searchParams.get('token'));
    // const userId = searchParams.get('userId');

    // const token = searchParams.get('token');

    const { TOKEN_VERIFY } = useGQL();
    const [tokenExpired, setTokenExpired] = useState(false);
    const [handleVerifyToken, { error: tokenError, loading: tokenLoading, data: tokenData }] = TOKEN_VERIFY();

    useEffect(() => {
        setUserId(searchParams.get('userId'));
        setToken(searchParams.get('token'));
        verifyToken();
    }, []);

    const verifyToken = async () => {
        try {
            await handleVerifyToken({
                variables: {
                    input: {
                        userId,
                        token
                    }
                }
            });
        } catch (err) {
            setTokenExpired(true);
        }
    };

    return (
        <AuthWrapper1>
            {tokenLoading ? (
                <CustomLoader  />
            ) : tokenError?.message ? (
                <TokenExpired />
            ) : (
                <>
                    {tokenError && <TokenExpired />}
                    {tokenData && (
                        <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                            <Grid item xs={12}>
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
                                                            <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                                <Typography
                                                                    color={theme.palette.secondary.main}
                                                                    gutterBottom
                                                                    variant={matchDownSM ? 'h3' : 'h2'}
                                                                >
                                                                    Reset Password
                                                                </Typography>
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <AppUserResetPassword />
                                                </Grid>
                                            </Grid>
                                        </AuthCardWrapper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </>
            )}
        </AuthWrapper1>
    );
};

export default ResetPassword;
