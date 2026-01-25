import { Link } from 'react-router-dom';

// material-ui
import { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from 'views/pages/AuthWrapper1';
import AuthCardWrapper from 'views/pages/AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AnimateButton from 'ui-component/extended/AnimateButton';
import AuthCodeVerification from '../auth-forms/AuthCodeVerification';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import AuthSlider from 'ui-component/cards/AuthSlider';
import { AuthSliderProps } from 'types';


// carousel items
const items: AuthSliderProps[] = [
    {
        title: 'Powerful and easy to use multi-purpose theme.',
        description: 'Powerful and easy to use multipurpose theme'
    },
    {
        title: 'Powerful and easy to use multi-purpose theme.',
        description: 'Powerful and easy to use multipurpose theme'
    },
    {
        title: 'Powerful and easy to use multi-purpose theme.',
        description: 'Powerful and easy to use multipurpose theme'
    }
];

// ===========================|| AUTH2 - CODE VERIFICATION ||=========================== //

const CodeVerification = () => {
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
                        {/* <Grid item sx={{ display: { xs: 'none', md: 'block' }, m: 3 }}>
                            <Link to="#" aria-label="theme logo">
                                <Logo />
                            </Link>
                        </Grid> */}
                        <Grid
                            item
                            xs={12}
                            container
                            justifyContent="center"
                            alignItems="center"
                            sx={{ minHeight: { xs: 'calc(100vh - 68px)', md: 'calc(100vh - 152px)' } }}
                        >
                            <Stack justifyContent="center" alignItems="center" spacing={5} m={2}>
                                {/* <Box component={Link} to="#" sx={{ display: { xs: 'block', md: 'none' } }}>
                                    <Logo />
                                </Box> */}
                                <AuthCardWrapper border={downLG}>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={12}>
                                            <Stack component={Link} alignItems={'center'} to="#" mb={3}>
                                                <Logo />
                                            </Stack>
                                            <Stack spacing={1}>
                                                <Typography gutterBottom align="center" variant={downMD ? 'h2' : 'h1'}>
                                                    Please enter the verification code
                                                </Typography>
                                                <Typography gutterBottom align="center" variant="body1" color="grey.600">
                                                    We’ve sent you the code to .****@gmail.com
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <AuthCodeVerification />
                                        </Grid>
                                        {/* <Grid item xs={12}>
                                            <Grid item container direction="column" alignItems="center" xs={12}>
                                                <Typography
                                                    variant="body1"
                                                    color="grey.600"
                                                    sx={{ textAlign: 'center', textDecoration: 'none' }}
                                                >
                                                    Didn’t receive the code
                                                </Typography>
                                                <Button
                                                    disableElevation
                                                    fullWidth
                                                    size="large"
                                                    type="submit"
                                                    variant="text"
                                                    color="primary"
                                                >
                                                    Resend Code
                                                </Button>
                                            </Grid>
                                        </Grid> */}
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

export default CodeVerification;
