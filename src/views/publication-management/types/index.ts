import { string } from 'yup';
import { PageStatusEnum, PageTypeEnum } from '../constants/publicatoin-management-enum';

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

export type PageManagementCms = {
    _id: string;
    title: string;
    metaData: string;
    pageImage: string;
    pageType: PageTypeEnum;
    slug: string;
    content: string;
    status: PageStatusEnum;
    author?: string;
    createdAt?: string;
    updatedAt?: string;
    version?: string;
};

export type PageManagementResponseType = {
    message: string;
    pagination?: BasePaginationResponse;
    data: PageManagementCms[];
    page?: PageManagementCms;
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
