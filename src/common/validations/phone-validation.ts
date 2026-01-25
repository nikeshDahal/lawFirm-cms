import * as Yup from 'yup';

export const phoneValidation = Yup.string()
    .matches(/^\+?\d{1,3}?[-.\s]?(\(?\d{1,4}?\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, 'Phone number is not valid')
    .min(7)
    .max(15)
    .optional()
    .required('')
    .label('Phone number');
