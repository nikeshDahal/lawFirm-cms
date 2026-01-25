import { ArrangementOrder } from 'types';

export type Admin = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
};

export type HeadCell = {
    id: string;
    numeric: boolean;
    label: string;
    disablePadding?: string | boolean | undefined;
    align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
    sort: boolean;
};

export enum AdminRoles {
    SUPER_ADMIN = 'SUPERADMIN',
    ADMIN = 'admin',
    EDITOR = 'editor'
}

export type RegisterType = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
};

export const adminRoleMap = {
    admin: 'ADMIN',
    editor: 'EDITOR'
};

export const userRole = [
    {
        value: 'ADMIN',
        label: 'Admin'
    },
    {
        value: 'EDITOR',
        label: 'Editor'
    }
];

// review state options
export const status = [
    {
        value: 'ACTIVE',
        label: 'Active'
    },
    {
        value: 'PENDING',
        label: 'Disabled'
    }
];

export const modalContent = {
    title: 'Delete',
    content: 'Are you sure you want to delete'
};

export type deleteAdminProps = {
    _id: string;
    role: string;
    status: string;
};

export enum AdminStatusEnum {
    ACTIVE = 'ACTIVE',
    VERIFIED = 'VERIFIED',
    PENDING = 'PENDING',
    INACTIVE = 'INACTIVE'
}

export enum AdminRolesEnum {
    SUPER_ADMIN = 'superAdmin',
    ADMIN = 'admin',
    EDITOR = 'editor'
}

export enum StatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING'
}

export enum PageActionEnum {
    ADD = 'Add',
    EDIT = 'Edit',
    DELETE = 'Delete',
    VIEW = 'View',
    DISABLE = 'Disable',
    ENABLE = 'Enable'
}

export type AdminProfile = {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    profileImage: string;
    profileImageUrl: string;
};

export type AdminTableProps = {
    admins: Admin[];
    handleRefetch: () => void;
    order: ArrangementOrder;
    orderBy: string;
    page: number;
    rowsPerPage: number;
    loading: boolean;
    handleRequestSort: (event: React.SyntheticEvent<Element, Event>, property: any) => void;
};
