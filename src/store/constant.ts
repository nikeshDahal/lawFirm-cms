// theme constant
export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;

export enum AdminRoles {
    SUPERADMIN = 'SUPERADMIN',
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR'
}

export enum AdminStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING'
}

export enum UserStatus {
    Active = 'Active',
    Disable = 'Disable'
}

export enum EmailTemplateStatus {
    Active = 'Active',
    Inactive = 'Inactive'
}

export const RowPerPageOptions = [10, 30, 50, 100];
