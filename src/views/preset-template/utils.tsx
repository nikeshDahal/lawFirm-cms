import { Chip } from '@mui/material';
import { PresetTemplateStatusEnum } from './constants/types';

export const getChip = (status: string) => {
    // status = formStatus(status);
    if (status === PresetTemplateStatusEnum.Active) {
        return <Chip label={status} color="success" />;
    }
    if (status === PresetTemplateStatusEnum.Inactive) {
        return <Chip label={status} color="error" />;
    }

    return '';
};

export function parseUserId(userId: string): { day: string; date: string } {
    const [day, dateStr] = userId.split(' ');
    const [dd, mm, yy] = dateStr.split('/');

    const date = `20${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    return { day, date };
}
