// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// assets

// ============================|| AUTH3 - RESET PASSWORD ||============================ //

const ResetPasswordSuccess = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Grid item xs={12}>
            <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                <Grid item>
                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                        <Typography color="success" gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Password set successfully. Now, you can login to the EB Theme application.
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ResetPasswordSuccess;
