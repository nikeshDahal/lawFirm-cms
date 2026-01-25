import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import { DASHBOARD_PATH } from 'config';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// assets
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';

import imageBackground from 'assets/images/maintenance/img-error-bg.svg';
import imageDarkBackground from 'assets/images/maintenance/img-error-bg-dark.svg';
import imageBlue from 'assets/images/maintenance/img-error-blue.svg';
import imageText from 'assets/images/maintenance/img-error-text.svg';
import imagePurple from 'assets/images/maintenance/img-error-purple.svg';
import LockIcon from '@mui/icons-material/Lock';

// types
import { ThemeMode } from 'types/config';

// ==============================|| ERROR PAGE ||============================== //

const Error = () => {
    const theme = useTheme();
    const imageSX = { position: 'absolute', top: 0, left: 0, width: '100%' };

    return (
        <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }} spacing={gridSpacing}>
            <Grid item xs={12}>
                <Box sx={{ maxWidth: { xs: 350, sm: 580, md: 720 }, margin: '0 auto', position: 'relative' }}>
                    <LockIcon />
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Stack justifyContent="center" alignItems="center" spacing={gridSpacing} sx={{ p: 1.5, maxWidth: 350 }}>
                    <Typography variant="h1">LOCKED</Typography>
                    <Typography variant="body2" align="center">
                        The page you are looking is Locked
                    </Typography>
                    <AnimateButton>
                        <Button variant="contained" size="large" component={Link} to={DASHBOARD_PATH}>
                            <HomeTwoToneIcon sx={{ fontSize: '1.3rem', mr: 0.75 }} /> Home
                        </Button>
                    </AnimateButton>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default Error;
