import { Link } from 'react-router-dom';

// material-ui
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import AuthWrapper1 from 'views/pages/AuthWrapper1';
import AuthCardWrapper from 'views/pages/AuthCardWrapper';

// ================================|| AUTH2 - LOGIN ||================================ //

const Login = () => {
    const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

    return (
        <AuthWrapper1>
            <Grid container justifyContent={{ xs: 'center', md: 'space-between' }} alignItems="center">
                <Grid item md={6} lg={7} xs={12} sx={{ minHeight: '100vh' }}>
                    <Grid
                        sx={{ minHeight: '100vh' }}
                        container
                        alignItems={{ xs: 'center', md: 'flex-start' }}
                        justifyContent={{ xs: 'center', md: 'space-between' }}
                    >
                        <Grid item xs={12} container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
                            <Stack justifyContent="center" alignItems="center" spacing={5} m={2}>
                                <AuthCardWrapper border={downLG}>
                                    <Grid container spacing={3} justifyContent="center">
                                        <Grid item>
                                            <Stack component={Link} alignItems={'center'} to="#" mb={3}>
                                                <Logo height="120" width="200" />
                                            </Stack>
                                            <Stack sx={{ mt: -2 }} spacing={1}>
                                                <Typography
                                                    sx={{ color: 'red', fontSize: '18px' }}
                                                    gutterBottom
                                                    align="center"
                                                    variant={downMD ? 'h2' : 'h1'}
                                                    className="text-gradient-gold"
                                                >
                                                    Top Legal Advisers
                                                </Typography>
                                            </Stack>
                                            <Stack sx={{ mt: 5 }} spacing={1}>
                                                <Typography gutterBottom align="center" variant={downMD ? 'h2' : 'h1'}>
                                                    Sign in to your account
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <AuthLogin loginProp={2} />
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
        </AuthWrapper1>
    );
};

export default Login;
