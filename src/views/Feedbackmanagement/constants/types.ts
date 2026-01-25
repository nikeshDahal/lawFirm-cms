import { TableCellProps } from '@mui/material';

export type Pagination = {
    total: number;
    hasNextPage: boolean;
};

export type GetFeedbackIDto = {
    limit: number;
    skip: number;
};

type UserInfo = {
    _id: string;
    fullName: string;
    email: string;
};

export type FeedbackBaseResponse = {
    title?: string;
    message: string;
    image?: any;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    imageUrl?: string;
    user?: UserInfo;
};

export type FeedbackResponse = {
    message?: string | null;
    pagination?: Pagination | null;
    feedbacks?: FeedbackBaseResponse[] | null;
    feedback?: FeedbackBaseResponse | null;
};

export type FeedbackResponseType = {
    findAllFeedback?: FeedbackResponse;
    findByIdFeedback?: FeedbackResponse;
    deleteByIdFeedback?: FeedbackResponse;
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
