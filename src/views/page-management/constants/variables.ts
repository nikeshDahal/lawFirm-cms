import { PageStatusEnum, PageTypeEnum } from './page-management-enum';

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
    { value: PageTypeEnum.HOME, label: 'Home' },
    { value: PageTypeEnum.RECOGNITION, label: 'Recognition' },
    { value: PageTypeEnum.ABOUT, label: 'About Us' },
    { value: PageTypeEnum.PRACTICE_AREAS, label: 'Practice Area' },
    { value: PageTypeEnum.PUBLICATIONS, label: 'Publication' },
    { value: PageTypeEnum.TEAMS, label: 'Teams' },
    { value: PageTypeEnum.PARTNERSHIPS, label: 'Partnership' },
    { value: PageTypeEnum.TESTIMONIALS, label: 'Testimonial' },
    { value: PageTypeEnum.CONTACT, label: 'Contact Us' },
    { value: PageTypeEnum.FAQ, label: 'FAQ' },
    { value: PageTypeEnum.GENERIC, label: 'Generic' },
    { value: PageTypeEnum.TERMS_AND_CONDITION, label: 'Terms And Conditions' },
    { value: PageTypeEnum.PRIVACY_POLICY, label: 'Privacy Policy' },
    { value: PageTypeEnum.BLOG, label: 'Blog' }
];

export const plugins = ['image', 'preview', 'code', 'fullscreen', 'table', 'wordcount', 'lists'];
