import { gql } from '@apollo/client';

export const APP_USER_RESET_PASSWORD = gql`
    mutation ($input: AppUserResetPasswordDTO!) {
        appUserResetPassword(input: $input)
    }
`;

export const LOGIN = gql`
    mutation ($input: LoginAdminDTO!) {
        login(input: $input) {
            admin {
                _id
                firstName
                lastName
                email
                phone
                role
                status
                enabled2FA
            }
            refreshToken
            accessToken
            expiresBy
            expiresAt
        }
    }
`;
// export const LOGIN = gql`
//     mutation ($input: LoginAdminDTO!) {
//         login(input: $input) {
//             admin {
//                 _id
//                 firstName
//                 lastName
//                 email
//                 phone
//                 role
//                 status
//                 enabled2FA
//             }
//             settings {
//                 _id
//                 description
//                 title
//                 slug
//                 order
//                 fieldType
//                 options {
//                     value
//                     label
//                 }
//                 value
//                 values
//             }
//             refreshToken
//             accessToken
//             expiresBy
//             expiresAt
//         }
//     }
// `;

export const REGISTER = gql`
    mutation ($input: CreateAdminDTO!) {
        register(input: $input) {
            _id
            firstName
            lastName
            email
            status
            role
            phone
        }
    }
`;

export const FORGOT_PASSWORD = gql`
    mutation ($input: ForgotPasswordDTO!) {
        forgotPassword(input: $input) {
            message
        }
    }
`;

export const RESET_PASSWORD = gql`
    mutation ($input: ResetPasswordDTO!) {
        resetPassword(input: $input)
    }
`;
export const VERIFY_TOKEN = gql`
    mutation ($input: ResetPasswordDTO!) {
        verifyToken(input: $input)
    }
`;

export const CODE_VERIFICATION = gql`
    mutation ($input: OtpVerificationFor2FADTO!) {
        otpVerificationFor2FA(input: $input) {
            admin {
                _id
                name
                email
                phone
                role
                status
            }
            refreshToken
            accessToken
        }
    }
`;

export const REFRESH_TOKEN = gql`
    mutation RefreshToken($refreshToken: String!) {
        refresh(refreshToken: $refreshToken) {
            accessToken
            refreshToken
        }
    }
`;

export const VALIDATE_OTP = gql`
    mutation ValidateOTP($otp: String!, $input: LoginAdminDTO!) {
        validateOTP(otp: $otp, input: $input) {
            message
            admin {
                _id
                createdAt
                updatedAt
                firstName
                lastName
                email
                role
                status
                phone
                profileImage
                profileImageUrl
                enabled2FA
            }
            accessToken
            refreshToken
            expiresBy
            expiresAt
        }
    }
`;

export const RESEND_OTP_CODE = gql`
    mutation ResendEmailOtp($input: LoginAdminDTO!) {
        resendEmailOtp(input: $input) {
            expiresBy
            expiresAt
        }
    }
`;
