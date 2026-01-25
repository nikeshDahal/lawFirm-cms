import { ReactNode } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DateTime } from 'luxon';

// project-import
import Chip from 'ui-component/extended/Chip';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons-react';
import User1 from 'assets/images/users/user-round.svg';

// types
import { ThemeMode } from 'types/config';
import { formatNotificationTime } from 'utils/time-formatter';
import useSnackbar from 'hooks/common/useSnackbar';
import { useGQL } from 'views/profile/hooks/useGQL';
import { useNavigate } from 'react-router-dom';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { NotificationType } from 'views/NotificationManagement/constants/types';

const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: '5px',

    '& .MuiListItem-root': {
        borderRadius: '6px',
        transition: 'background 0.3s ease-in-out',
        '&:hover': {
            background: '#7f85d1'
        }
    },
    '& .MuiListItemAvatar-root': {
        minWidth: '30px'
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

export const NotificationList = ({ notifications, onClose, onRead, markAsReadHandler }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const handleRead = async (e, n) => {
        console.log('user deytails', n);
        if (n?.theme === NotificationType.SUBSCRIPTION_PURCHASE) {
            navigate(`/subscription-products/detail/${n?.userId}`);
        } else if (n?.theme !== NotificationType.SUCCESSFUL_USER_DELETED) {
            navigate(`/app-user/profile/${n?.userId}`);
        }

        if (!n.isOpen) {
            await onRead(n._id);
            markAsReadHandler(n._id);
        }

        onClose(e);
    };

    return (
        <List
            sx={{
                py: 0,
                borderRadius: '12px',
                '& .MuiListItemSecondaryAction-root': { top: 22 },
                '& .MuiDivider-root': { my: 0 },
                '& .list-container': { pl: 5 },
                '& .unread': {
                    background: theme.palette.primary.light,
                    borderRadius: '6px'
                }
            }}
        >
            {notifications?.map((n) => (
                <ListItemWrapper
                    sx={{
                        borderBottom: '2px solid #f5f5f5',
                        marginBottom: '2px'
                    }}
                >
                    <ListItem
                        alignItems="center"
                        className={n.isOpen === true ? '' : 'unread'}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '10px',
                            borderRadius: '8px',
                            padding: '10px'
                        }}
                        onClick={(e) => handleRead(e, n)}
                    >
                        <Avatar
                            sx={{
                                width: '32px',
                                height: '32px',
                                mr: 1.5,
                                bgcolor: theme.palette.background.paper
                            }}
                        >
                            <NotificationsNoneIcon sx={{ color: theme.palette.primary.main }} />
                        </Avatar>
                        <Stack direction="column" spacing={0.5}>
                            <Typography sx={{ color: n.isOpen ? '#000000' : '#ffffff' }} variant="subtitle1">
                                {n?.description}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: '12px',
                                    color: n.isOpen ? '#000000' : '#ffffff'
                                }}
                                display="block"
                            >
                                {formatNotificationTime(new Date(n?.createdAt!))}
                            </Typography>
                        </Stack>
                    </ListItem>
                </ListItemWrapper>
            ))}
        </List>
    );
};
