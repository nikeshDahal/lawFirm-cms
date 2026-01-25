import { Box, Button, Chip, Stack, Typography, alpha, useTheme } from '@mui/material';
import { IconBorderRadius } from '@tabler/icons-react';
import SortDropdown from 'components/sort-button';
import { useNavigate } from 'react-router-dom';

type sortHeaderProps = {
    title: string;
    linkTo?: string;
    total?: number;
};

function Header({ title, linkTo, total }: sortHeaderProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const totalSx = {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        padding: '11px 12px',
        borderRadius: '6px',
        fontSize: 17,
        lineHeight: 'calc(22/17)',
        letterSpacing: '-0.43px',
        color: '#000',
        marginBottom: '24px'
    };

    return (
        <>
            <Stack
                flexDirection={{ sm: 'row' }}
                justifyContent={{ sm: 'space-between' }}
                alignItems={{ sm: 'center' }}
                sx={{ mb: total ? 2 : 4 }}
                spacing={{ xs: 2, sm: 0 }}
            >
                <Typography variant="h3">{title}</Typography>
                <Button
                    onClick={() => {
                        navigate(linkTo!);
                    }}
                >
                    View all
                </Button>
            </Stack>
        </>
    );
}

export default Header;
