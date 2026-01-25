import { string } from 'yup';

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
    // createdBy?: string;
    createdAt?: string;
    content: string;
    status: string;
    updatedAt?: string;
    pageType: string;
    slug: string;
    version: string;
    seoTags: {
        title: string;
        description: string;
        tags: string;
    };
    author?: string;
};

export type PageManagementResponseType = {
    message: string;
    pagination?: BasePaginationResponse;
    pages: PageManagement[];
    page?: PageManagement;
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
