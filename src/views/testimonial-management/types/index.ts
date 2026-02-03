import { string } from 'yup';
import { PageStatusEnum, PageTypeEnum } from '../constants/testimonials-management-enum';

export type BasePaginationResponse = {
    total: number;
    hasNextPage: boolean;
};

export type PageManagement = {
    _id: string;
    title: string;
    createdBy: string;
    createdAt: string;
    content: string;
    status: string;
    updatedAt: string;
    __typename: string;
};

export type TestimonialCms = {
    _id: string;
    message: string;
    rating: number;
    clientName: string;
    clientDesignation: string;
    clientImage: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
};

export type PageManagementResponseType = {
    message: string;
    pagination?: BasePaginationResponse;
    data: TestimonialCms[];
    page?: TestimonialCms;
};

export type PageManagementResponse = {
    listPages?: PageManagementResponseType;
    listPage?: PageManagementResponseType;
    updatePage?: PageManagementResponseType;
};

export type ConfirmModalProps = {
    open: boolean;
    title: string;
    content: string;
    yes: any;
    no?: any;
    buttonLabelYes: string;
    buttonLabelNo?: string;
    loader?: boolean;
    size?: string;
    icon?: JSX.Element;
    handleClose: () => void;
};

export type ArrangementOrder = 'asc' | 'desc' | undefined;
