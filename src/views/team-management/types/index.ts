import { PageStatusEnum } from '../constants/team-management-enum';

export type BasePaginationResponse = {
    total: number;
    hasNextPage: boolean;
};

export type TeamMember = {
    _id: string;
    name: string;
    designation: string;
    practiceArea: string;
    profileImage: string;
    socialLinks: {
        facebook: string;
        email: string;
        linkedIn: string;
        twitter: string;
    };
    createdAt: string;
    updatedAt: string;
    status: PageStatusEnum;
};

export type TeamManagementResponseType = {
    message: string;
    pagination?: BasePaginationResponse;
    data: TeamMember[];
    page?: TeamMember;
};

export type ArrangementOrder = 'asc' | 'desc';

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
