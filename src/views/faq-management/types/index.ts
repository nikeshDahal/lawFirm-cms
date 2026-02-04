import { PageStatusEnum } from '../constants/faq-management-enum';

export type BasePaginationResponse = {
    total: number;
    hasNextPage: boolean;
};

export type FaqItem = {
    question: string;
    answer: string;
    status: PageStatusEnum;
};

export type FaqPage = {
    _id?: string;
    items: FaqItem[];
};

export type FaqManagementResponseType = {
    message: string;
    pagination?: BasePaginationResponse;
    page?: FaqPage;
};

export type ArrangementOrder = 'asc' | 'desc';
