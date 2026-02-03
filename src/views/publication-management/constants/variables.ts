import { PageStatusEnum, PageTypeEnum } from './publicatoin-management-enum';

export const PageStatus = [
    {
        value: PageStatusEnum.ACTIVE,
        label: 'Active'
    },
    {
        value: PageStatusEnum.INACTIVE,
        label: 'Inactive'
    }
];
export const PageTypes = [
    { value: PageTypeEnum.PUBLICATIONS, label: 'Publication' },
    { value: PageTypeEnum.BLOG, label: 'Blog' }
];

export const PageTypeMapp = {
    PUBLICATIONS: 'Publication',
    BLOG: 'Blog'
};

export const plugins = ['image', 'preview', 'code', 'fullscreen', 'table', 'wordcount', 'lists'];
