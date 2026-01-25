// material-ui
import { useTheme } from '@mui/material/styles';
import { FormControlLabel, PaletteMode, Radio, RadioGroup, Stack, Typography } from '@mui/material';

// project-imports
import Avatar from 'ui-component/extended/Avatar';
import useConfig from 'hooks/useConfig';

// assets
import { IconMoon, IconSun } from '@tabler/icons-react';
import { ThemeMode } from 'types/config';

// ==============================|| CUSTOMIZATION - MODE ||============================== //

const ThemeModeLayout = () => {
    const theme = useTheme();
    // const { navType, onChangeMenuType } = useConfig();
    const { mode, onChangeMode } = useConfig();

    return (
        <>
        <Typography variant="h5">Theme Mode</Typography>
        <Stack spacing={2.5} p={2} sx={{ width: '100%' }}>
            <RadioGroup
                row
                aria-label="layout"
                value={mode}
                onChange={(e) => onChangeMode(e.target.value as ThemeMode)}
                name="row-radio-buttons-group"
            >
                <FormControlLabel
                    control={<Radio value="light" sx={{ display: 'none' }} />}
                    label={
                        <Avatar
                            variant="rounded"
                            outline
                            sx={{
                                mr: 1,
                                width: 48,
                                height: 48,
                                ...(theme.palette.mode !== 'light' && { borderColor: theme.palette.divider + 20 })
                            }}
                        >
                            <IconSun color={theme.palette.warning.dark} />
                        </Avatar>
                    }
                />
                <FormControlLabel
                    control={<Radio value="dark" sx={{ display: 'none' }} />}
                    label={
                        <Avatar
                            size="md"
                            variant="rounded"
                            color="dark"
                            sx={{
                                width: 48,
                                height: 48,
                                ...(theme.palette.mode === 'dark' && { border: `2px solid ${theme.palette.primary.main}` })
                            }}
                        >
                            <IconMoon style={{ transform: 'rotate(220deg)', color: theme.palette.grey[100] }} />
                        </Avatar>
                    }
                />
            </RadioGroup>
        </Stack>
        </>
    );
};

export default ThemeModeLayout;
