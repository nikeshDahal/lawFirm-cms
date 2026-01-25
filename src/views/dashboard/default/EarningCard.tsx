import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from '../skeleton/EarningCard';

// assets
import { MoneyIcon } from 'components/icons';

// types
import { ThemeMode } from 'types/config';
import { Stack, alpha } from '@mui/material';

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

interface EarningCardProps {
    isLoading: boolean;
    totalUsers: number;
}

const EarningCard = ({ isLoading, totalUsers }: EarningCardProps) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = React.useState<Element | (() => Element) | null | undefined>(null);

    const handleClick = (event: React.SyntheticEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <MainCard
                    border={false}
                    content={false}
                    sx={{
                        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'primary.main',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: `linear-gradient(210deg, #FFF -50.94%, rgba(255, 255, 255, 0.00) 83.49%)`,
                            borderRadius: '50%',
                            top: { xs: -105, sm: -1 },
                            right: { xs: -140, sm: -119 }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: 'linear-gradient(141deg, #FFF -14.02%, rgba(243, 243, 243, 0.00) 77.58%)',
                            borderRadius: '50%',
                            top: { xs: -155, sm: -135 },
                            right: { xs: -70, sm: -68 },
                            opacity: 0.5
                        }
                    }}
                >
                    <Box sx={{ p: '14px 20px' }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item sx={{ width: 40, height: 40 }}></Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2rem', lineHeight: 'calc(35/32)', fontWeight: 600, mr: 1, mb: 2 }}>
                                            {totalUsers}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography
                                    sx={{
                                        fontSize: '1.125rem',
                                        color: theme.palette.mode === ThemeMode.DARK ? 'text.secondary' : 'background.paper'
                                    }}
                                >
                                    Total users
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
};

export default EarningCard;
