import * as Yup from 'yup';

export const validationSchemaUserProfile = Yup.object().shape({
    firstName: Yup.string().min(3).max(30).required().label('First name'),
    lastName: Yup.string().min(3).max(30).required().label('Last name')
});

export const initialValuesChangePassword = { password: '', passwordConfirm: '', current: '' };

export const validationSchemaChangePassword = Yup.object().shape({
    password: Yup.string()
        .min(8)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required()
        .notOneOf([Yup.ref('current')], 'New password cannot be the same as the old password')
        .label('New password'),
    passwordConfirm: Yup.string()
        .required()
        .label('Repeat new password')
        .oneOf([Yup.ref('password')], 'Both passwords must match'),
    current: Yup.string().max(255).required().label('Old password')
});

export const initialValuesOtp = { token: '' };

export const validationSchemaOtp = Yup.object().shape({
    token: Yup.string().min(6).max(6).required().label('Code')
});

export const configurationList = [
    `Open mailbox and check for the code.`,
    `Enter the code in the field below.`,
    `Click the Verify button to continue.`
];

export type TwoFactorAuthProps = {
    otpAuthUrl: string;
    base32: string;
    closeModal: () => void;
};

export const AdminStatusMap = {
    ACTIVE: 'Active',
    PENDING: 'Disabled'
};

export const AdminRolesMap = {
    SUPERADMIN: 'Super Admin',
    ADMIN: 'Admin',
    EDITOR: 'Editor'
};

export const allowedImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const fileSize = 2097152;
export const allowedImageTypesForIcon = ['image/png'];
