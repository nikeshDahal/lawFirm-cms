import { Link, useSearchParams } from 'react-router-dom';

// material-ui
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import Logo from 'ui-component/Logo';
import AuthResetPassword from '../auth-forms/AuthResetPassword';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import AuthWrapper1 from 'views/pages/AuthWrapper1';
import AuthCardWrapper from 'views/pages/AuthCardWrapper';
import { useEffect, useState } from 'react';
import useGQL from '../hooks/useGQL';
import TokenExpired from '../pages/TokenExpired';
import InvalidLink from '../pages/InvalidLink';
import CustomLoader from 'components/loader';

// ============================|| AUTH2 - RESET PASSWORD ||============================ //

const ResetPassword = () => {
    const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

    const [searchParams, setSearchParams] = useSearchParams();
    const [userId, setUserId] = useState(searchParams.get('userId'));
    const [token, setToken] = useState(searchParams.get('token'));

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
                <InvalidLink />
            ) : (
                <>
                    {tokenError && <TokenExpired />}
                    {tokenData && (
            <Grid container justifyContent={{ xs: 'center', md: 'space-between' }} alignItems="center">
                <Grid item md={6} lg={7} xs={12} sx={{ minHeight: '100vh' }}>
                    <Grid
                        sx={{ minHeight: '100vh' }}
                        container
                        alignItems={{ xs: 'center', md: 'flex-start' }}
                        justifyContent={{ xs: 'center', md: 'space-between' }}
                    >
                        <Grid
                            item
                            xs={12}
                            container
                            justifyContent="center"
                            alignItems="center"
                            sx={{ minHeight: '100vh' }}
                        >
                            <Stack justifyContent="center" alignItems="center" spacing={5} m={2}>
                                <AuthCardWrapper border={downLG}>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={12}>
                                        <Stack component={Link} to="#" alignItems={'center'} mb={2}>
                                                <Logo />
                                            </Stack>
                                            <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                <Typography color="primary" gutterBottom variant={downMD ? 'h3' : 'h2'}>
                                                    Reset Password
                                                </Typography>
                                                <Typography variant="caption" fontSize="16px" textAlign="center">
                                                    Please choose your new password
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <AuthResetPassword />
                                        </Grid>
                                    </Grid>
                                </AuthCardWrapper>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
                    <BackgroundPattern2>
                       <></>
                    </BackgroundPattern2>
                </Grid>
            </Grid>
            )}
            </>
        )}
        </AuthWrapper1>
    );
};

export default ResetPassword;
