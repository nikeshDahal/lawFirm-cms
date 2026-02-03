export enum PageStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export enum AdminRolesTypeEnum {
    SUPER_ADMIN = 'SUPERADMIN',
    ADMIN = 'ADMIN'
}

export enum PaginationSortEnum {
    ASC = 'asc',
    DESC = 'desc'
}

export const PageStatusMap = {
    [PageStatusEnum.ACTIVE]: 'Active',
    [PageStatusEnum.INACTIVE]: 'Inactive'
};
