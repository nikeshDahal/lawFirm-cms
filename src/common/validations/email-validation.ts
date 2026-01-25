import * as Yup from 'yup';

export const emailValidation = Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Enter a valid email')
    .required('Email is a required field')
    .max(254, 'Email must be at most 254 characters long')
    .label('Email');
