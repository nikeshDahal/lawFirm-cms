import { PageStatusEnum, PageStatusEnumForm, PageTypeEnum } from './testimonials-management-enum';

export const PageStatus = [
    {
        value: PageStatusEnumForm.ACTIVE,
        label: 'Active'
    },
    {
        value: PageStatusEnumForm.INACTIVE,
        label: 'Inactive'
    }
];

export const PageStatusMapping = {
    [PageStatusEnum.ACTIVE]: 'Active',
    [PageStatusEnum.INACTIVE]: 'Inactive'
};
export const PageTypes = [
    { value: PageTypeEnum.PUBLICATIONS, label: 'Publication' },
    { value: PageTypeEnum.BLOG, label: 'Blog' }
];

export const PageTypeMapp = {
    PUBLICATIONS: 'Publication',
    BLOG: 'Blog'
};

export const plugins = ['image', 'preview', 'code', 'fullscreen', 'table', 'wordcount', 'lists'];
