import { gql } from '@apollo/client';

export const CHANGE_PASSWORD = gql`
    mutation ($input: ChangePasswordDTO!) {
        changePassword(input: $input) {
            message
            status
        }
    }
`;

// export const GET_PRESIGNED_URL = gql`
//     mutation ($input: PreSignedUrlInput!) {
//         getPreSignedUrl(input: $input) {
//             url
//         }
//     }
// `;

export const VERIFY_OTP = gql`
    mutation ($token: String!) {
        verifyAuthOTP(token: $token) {
            message
        }
    }
`;
export const LOGOUT_ADMIN = gql`
    mutation LogOut {
        logOut {
            message
        }
    }
`;

export const MARK_AS_SEEN_NOTIFICATION = gql`
    mutation MarkAsSeen($notificationId: String!) {
        markAsSeen(notificationId: $notificationId) {
            message
        }
    }
`;

export const MARK_ALL_SEEN_NOTIFICATION = gql`
    mutation MarkAllAsSeen {
        markAllAsSeen {
            message
        }
    }
`;
export const UPDATE2FAGQL = gql`
    mutation Update2FA($status: Boolean!) {
        update2FA(status: $status) {
            message
        }
    }
`;
