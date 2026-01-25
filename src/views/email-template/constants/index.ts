import { CustomFields, HeadCell1 } from 'types';
import * as Yup from 'yup';
import slugify from 'slugify';
import { v4 as uuid } from 'uuid';
import { EmailTemplate, InputEmailTemplate } from '../types';

// table header options
export const headCells: HeadCell1[] = [
    {
        id: 'title',
        numeric: false,
        label: 'Template title',
        align: 'left',
        sort: false
    },
    {
        id: 'Date uploaded',
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

export const defaultValue: InputEmailTemplate = {
    title: '',
    slug: '',
    subject: '',
    body: ''
};

export const fields: CustomFields = [
    {
        main: [
            {
                name: 'header',
                mainHeading: { align: 'left', title: 'Template Details', variant: 'body1' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'title',
                        type: 'text',
                        label: 'Title',
                        placeholder: 'Title',
                        customHandleChange: (name, event, setFieldValue, handleChange) => {
                            setFieldValue('main[0][header][0][slug]', slugify(event.target.value).toLowerCase());
                            handleChange(event);
                        }
                    },
                    {
                        disabled: true,
                        name: 'slug',
                        type: 'text',
                        label: 'Slug',
                        placeholder: 'Slug'
                    },
                    {
                        name: 'subject',
                        type: 'text',
                        label: 'Subject',
                        placeholder: 'Subject'
                    }
                ]
            }
        ],
        sub: []
    }
];

Yup.setLocale({
    string: {
        matches: '${label} must contain only numbers',
        min: '${label} must be at least ${min} characters',
        max: '${label} must be at most ${max} characters'
    }
});

// Custom method to validate ReactQuill content
const validateContent = (value) => {
    // Quill uses <p><br></p> to represent an empty editor, so we check for this
    const isEmptyContent = !value || value === '<p><br></p>';
    if (isEmptyContent) {
        return false; // Fail validation
    }
    return true; // Pass validation
};

export const validationSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .max(150, 'Title must be at most 150 characters')
        .required('Title is a required field'),
    slug: Yup.string().trim().required('Slug is a required field'),
    subject: Yup.string()
        .min(3, 'Subject must be at least 3 characters')
        .max(150, 'Subject must be at most 150 characters')
        .required('Subject is a required field'),
    body: Yup.string()
        .test('body', 'Body cannot be empty', (value) => validateContent(value)) // Custom content validation
        .min(3)
        .max(500)
        .required()
        .label('Email body')
});

export const chipValues = [
    { label: 'Name', value: 'name' },
    { label: 'Link', value: 'link' },
    { label: 'Otp', value: 'otp' }
];
