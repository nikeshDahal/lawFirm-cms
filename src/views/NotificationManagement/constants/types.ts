import { TableCellProps } from '@mui/material';

export type Pagination = {
    total: number;
    hasNextPage: boolean;
};

export type GeNotificationDTO = {
    limit: number;
    skip: number;
};

export type NotificationTemplateResponse = {
    userId: string;
    theme?: string;
    themeAttributes?: any;
    description: string;
    readAt: Date;
    viewedAt: Date;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    isOpen?: boolean;
};

export type NotificationResponse = {
    message: string;
    pagination?: Pagination | null;
    notifications?: NotificationTemplateResponse[] | null;
    notification?: NotificationTemplateResponse | null;
    unreadCount?: number;
};

export type DashboardResponse = {
    listAdminNotifications?: NotificationResponse;
    deleteNotifications?: NotificationResponse;
    // getEmailTemplate?: EmailTemplateResponseType;
    // createEmailTemplate?: EmailTemplateResponseType;
    // updateEmailTemplate?: EmailTemplateResponseType;
    // removeEmailTemplate?: EmailTemplateResponseType;
};

interface INotification {
    notifications?: NotificationTemplateResponse | null;
    message: string;
    pagination?: Pagination | null;
    unreadCount: number;
}

export type NotificationAdminResponse = {
    listAdminNotifications?: INotification;
};

export interface EnhancedTableHeadProps extends TableCellProps {
    headCells: HeadCell[];
    order: ArrangementOrder;
    orderBy: string;
    onRequestSort: (e: React.SyntheticEvent, p: string) => void;
}

export type HeadCell = {
    id: string;
    numeric: boolean;
    label: string;
    disablePadding?: string | boolean | undefined;
    align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
    sort: boolean;
};

export type ArrangementOrder = 'asc' | 'desc' | undefined;

export enum NotificationType {
    SUBSCRIPTION_PURCHASE = 'SUBSCRIPTION_PURCHASE',
    SCHEDULE_FINISHED = 'SCHEDULE_FINISHED',
    WELCOME = 'WELCOME',
    VISUAL_SUPPORT_CREATED = 'VISUAL_SUPPORT_CREATED',
    VISUAL_SUPPORT_UPDATED = 'VISUAL_SUPPORT_UPDATED',
    VISUAL_SUPPORT_DELETED = 'VISUAL_SUPPORT_DELETED',
    PROFILE_UPDATED_SUCCESSFUL = 'PROFILE_UPDATED_SUCCESSFUL',
    SUCCESSFUL_USER_DELETED = 'SUCCESSFUL_USER_DELETED',
    SUCCESSFUL_REGISTRATION = 'SUCCESSFUL_REGISTRATION'
}
