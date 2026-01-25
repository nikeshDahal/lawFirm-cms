import { ReactNode } from 'react';

// material-ui
import { alpha, useTheme, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from '../skeleton/TotalIncomeCard';

// types
import { ThemeMode } from 'types/config';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: alpha(theme.palette.primary.main, 0.32),
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.background.paper} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -34,
        right: -176
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.background.paper} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -124
    }
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

interface TotalIncomeLightCardProps {
    isLoading: boolean;
    icon: ReactNode;
    label: string;
    total: number;
    mainBgColor?: string;
    textColor?: string;
    isMoney?: boolean;
}

const TotalIncomeLightCard = ({ isLoading, total, icon, label, mainBgColor, textColor, isMoney }: TotalIncomeLightCardProps) => {
    const theme = useTheme();

    return (
        <>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: '7px 4px 7px 10px', bgcolor: mainBgColor }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar sx={{ minWidth: 48 }}>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            bgcolor:
                                                label === 'Total Income'
                                                    ? '#ECECEC'
                                                    : theme.palette.mode === ThemeMode.DARK
                                                      ? 'dark.main'
                                                      : label === 'Meeting attends'
                                                        ? 'text.primary'
                                                        : 'primary.main',
                                            color:
                                                label === 'Total Income'
                                                    ? '#000CA4'
                                                    : label === 'Meeting attends'
                                                      ? 'error.dark'
                                                      : 'background.paper',
                                            width: 38,
                                            height: 38,
                                            flexGrow: 1,
                                            objectFit: 'contain'
                                        }}
                                    >
                                        {icon}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{ py: 0 }}
                                    primary={
                                        <Typography sx={{ color: textColor }} variant="h4">
                                            {isMoney ? `$ ${total}` : total}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="subtitle2" sx={{ color: textColor, letterSpacing: '0.4px' }}>
                                            {label}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

export default TotalIncomeLightCard;
