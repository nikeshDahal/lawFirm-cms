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
    {
        value: PageTypeEnum.ABOUT,
        label: 'About Us'
    },
    {
        value: PageTypeEnum.GENERIC,
        label: 'Generic'
    },
    {
        value: PageTypeEnum.CONTACT,
        label: 'Contact Us'
    },
    {
        value: PageTypeEnum.TERMS_AND_CONDITION,
        label: 'Terms And Conditions'
    },
    {
        value: PageTypeEnum.PRIVACY_POLICY,
        label: 'Privacy Policy'
    }
];

export const PageTypeMapp = {
    ABOUT: 'About Us',
    GENERIC: 'Generic',
    CONTACT: 'Contact Us',
    TERMS_AND_CONDITION: 'Terms And Conditions',
    PRIVACY_POLICY: 'Privacy Policy'
};

export const plugins = ['image', 'preview', 'code', 'fullscreen', 'table', 'wordcount', 'lists'];
