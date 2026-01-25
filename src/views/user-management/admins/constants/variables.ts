import * as Yup from 'yup';
import { HeadCell } from './types';
import { emailValidation, phoneValidation } from 'common/validations';

// table header options
export const headCells: HeadCell[] = [
    {
        id: 'firstName',
        numeric: false,
        label: 'First name',
        align: 'left',
        sort: false
    },
    {
        id: 'lastName',
        numeric: false,
        label: 'Last name',
        align: 'left',
        sort: false
    },
    {
        id: 'email',
        numeric: false,
        label: 'Email',
        align: 'left',
        sort: false
    },
    {
        id: 'role',
        numeric: false,
        label: 'Permissions',
        align: 'left',
        sort: false
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
        align: 'left',
        sort: false
    }
];

export const defaultAdmin = {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'ADMIN',
    status: 'ACTIVE'
};

export const title = 'Delete Admin';
export const description = 'Are you sure you want to delete ?';

export const validationSchemaEditAdmin = Yup.object().shape({
    name: Yup.string()
        .min(3)
        .max(20)
        .matches(/^[a-zA-Z\s]+$/, 'Name must be letters only no special charaters and numbers allowed')
        .required()
        .label('Name'),

    phone: Yup.string().matches(/^\d+$/, 'Phone number must contain only numbers').min(7).max(15).required().label('Phone'),
    role: Yup.mixed().oneOf(['ADMIN', 'EDITOR']).required().label('Role'),
    status: Yup.mixed().oneOf(['active', 'pending']).required().label('Status')
});

export const validationSchemaAddAdmin = Yup.object().shape({
    firstName: Yup.string()
        .min(3)
        .max(20)
        .matches(/^[a-zA-Z\s]+$/, 'First name must be letters only no special charaters and numbers allowed')
        .required()
        .label('First name'),
    lastName: Yup.string()
        .min(3)
        .max(20)
        .matches(/^[a-zA-Z\s]+$/, 'Last name must be letters only no special charaters and numbers allowed')
        .required()
        .label('Last name'),
    email: Yup.string().email().required().label('Email'),
    phone: Yup.string().matches(/^\d+$/, 'Phone number must contain only numbers').min(7).max(15).required().label('Phone'),
    role: Yup.mixed().oneOf(['ADMIN', 'EDITOR']).required().label('Role'),
    status: Yup.mixed().oneOf(['ACTIVE', 'PENDING']).required().label('Status')
});

export const validateCreateOrEdit = Yup.object().shape({
    firstName: Yup.string()
        .min(3)
        .max(20)
        .matches(/^[a-zA-Z\s]+$/, 'First name must be letters only no special characters and numbers allowed')
        .required()
        .label('First name'),
    lastName: Yup.string()
        .min(3)
        .max(20)
        .matches(/^[a-zA-Z\s]+$/, 'First name must be letters only no special characters and numbers allowed')
        .required()
        .label('Last name'),
    email: emailValidation,
    phone: Yup.string().matches(/^\d+$/, 'Phone number must contain only numbers').min(7).max(15).required().label('Phone'),
    role: Yup.mixed().oneOf(['ADMIN', 'EDITOR']).required().label('Role'),
    status: Yup.mixed().oneOf(['ACTIVE', 'PENDING']).required().label('Status')
});

export const modalDeleteContent = {
    title: 'Delete',
    content: 'This will remove them from the system and lorem ipsum about other effects this will have'
};

export const modalDisableContent = {
    title: 'Disable',
    content: 'Are you sure you want to'
};

// review state options
export const status = [
    {
        value: 'ACTIVE',
        label: 'Active'
    },
    {
        value: 'PENDING',
        label: 'Pending'
    }
];
