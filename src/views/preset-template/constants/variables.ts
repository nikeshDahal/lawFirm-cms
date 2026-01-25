import dayjs from 'dayjs';
import { CustomFields, HeadCell1 } from 'types';
import * as Yup from 'yup';
import { FilterTemplateType } from './types';
import { v4 as uuid } from 'uuid';

// table header options
export const headCellsForTask: HeadCell1[] = [
    {
        id: 'templateName',
        numeric: false,
        label: 'Template name',
        align: 'left',
        sort: false
    },
    {
        id: 'Category',
        numeric: false,
        label: 'Category',
        align: 'left',
        sort: false
    },
    {
        id: 'steps',
        numeric: false,
        label: 'Steps',
        align: 'left',
        sort: false
    },
    {
        id: 'Downloaded',
        numeric: false,
        label: 'Downloaded',
        align: 'left',
        sort: false
    },
    {
        id: 'Dateuploaded',
        numeric: false,
        label: 'Date uploaded',
        align: 'left',
        sort: false
    },
    {
        id: 'Status',
        numeric: false,
        label: 'Status',
        align: 'left',
        sort: false
    }
];

export const validationSchemaForUpdate = Yup.object().shape({
    taskName: Yup.string()
        .min(3, 'Template name must be at least 3 characters')
        .max(50, 'Template name must be at most 50 characters')
        .required('Template name is a required field')
        .test('not-only-spaces', 'Template name cannot be only spaces', (value) => typeof value === 'string' && value.trim().length > 0),

    status: Yup.string().required('Status is a required field'),

    taskCategory: Yup.array()
        .of(
            Yup.object().shape({
                id: Yup.string().required('Category id must not be empty'),
                categoryName: Yup.string().required('Category name is required')
            })
        )
        .min(1, 'At least one category is required')
        .max(3, 'Task category must be less than 3'),

    taskStep: Yup.array()
        .of(
            Yup.object().shape({
                stepName: Yup.string()
                    .min(3, 'Step name must be at least 3 characters')
                    .max(100, 'Step name must be at most 50 characters')
                    .required('Step name is required')
                    .test(
                        'not-only-spaces',
                        'Step name cannot be only spaces',
                        (value) => typeof value === 'string' && value.trim().length > 0
                    )
            })
        )
        .min(1, 'At least one step is required')
});

export const validationSchema = Yup.object().shape({
    taskName: Yup.string()
        .min(3, 'Template name must be at least 3 characters')
        .max(50, 'Template name must be at most 50 characters')
        .required('Template name is a required field')
        .test('not-only-spaces', 'Template name cannot be only spaces', (value) => typeof value === 'string' && value.trim().length > 0),
    taskCategory: Yup.array()
        .of(
            Yup.object().shape({
                id: Yup.string().required('Category id must not be empty'),
                categoryName: Yup.string().required('Category name is required')
            })
        )
        .min(1, 'At least one category is required')
        .max(3, 'Task category must be less than 3'),

    taskStep: Yup.array()
        .of(
            Yup.object().shape({
                stepName: Yup.string()
                    .min(3, 'Step name must be at least 3 characters')
                    .max(100, 'Step name must be at most 50 characters')
                    .required('Step name is required')
                    .test(
                        'not-only-spaces',
                        'Step name cannot be only spaces',
                        (value) => typeof value === 'string' && value.trim().length > 0
                    )
            })
        )
        .min(1, 'At least one step is required')
});

export const initialValues = {
    taskName: '',
    taskCategory: [{ id: '', categoryName: '', imageKey: '' }],
    taskStep: [{ id: uuid(), stepName: '', timerInTimeStamp: null, timer: null, imageKey: '' }]
};

export const taskCategories = [
    { id: '6780a991d0af21de887c387f', categoryName: 'Self-care' },
    { id: '6780a991d0af21de887c3881', categoryName: 'Routines' },
    { id: '6780a991d0af21de887c3883', categoryName: 'School' },
    { id: '6780a991d0af21de887c3885', categoryName: 'Work' },
    { id: '6780a992d0af21de887c3887', categoryName: 'Fun Activities' },
    { id: '6780a992d0af21de887c3889', categoryName: 'Emotional Regulation' },
    { id: '6780a992d0af21de887c388b', categoryName: 'Beliefs and Practices' },
    { id: '6780a992d0af21de887c388d', categoryName: 'Health & Wellbeing' },
    { id: '6780a992d0af21de887c388f', categoryName: 'Transport' },
    { id: '6780a992d0af21de887c3891', categoryName: 'Events' },
    { id: '6780a993d0af21de887c3893', categoryName: 'Places' }
];

export const FilterMenuList: FilterTemplateType[] = [
    {
        _id: '',
        section: 'category',
        label: 'All',
        value: 'all'
    },

    {
        _id: '',
        section: 'downloads',
        label: 'All',
        value: 'all'
    },
    {
        _id: '',
        section: 'downloads',
        label: 'Least',
        value: 'desc'
    },
    {
        _id: '',
        section: 'downloads',
        label: 'Most',
        value: 'asc'
    }
];

export const TaskTemplateStatus = [
    {
        value: 'Active',
        label: 'Active'
    },
    {
        value: 'Inactive',
        label: 'Inactive'
    }
];
