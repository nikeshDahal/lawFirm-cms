import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
    query {
        getUserProfile {
            _id
            firstName
            lastName
            email
            phone
            status
            role
            profileImage
            profileImageUrl
        }
    }
`;

export const GET_AUTH_URL = gql`
    query {
        generateOtpAuthUrl {
            base32
            otpAuthUrl
        }
    }
`;

export const GET_PRESIGNED_URL = gql`
    query GetPreSignedUrl($input: PreSignedUrlInput!) {
        getPreSignedUrl(input: $input) {
            message
            url
        }
    }
`;

export const GET_PRESIGNED_URL_FOR_AVATAR = gql`
    mutation GetImageUrlFromS3($input: String!) {
        getImageUrlFromS3(input: $input)
    }
`;

export const GET_NOTIFICATIONS_FOR_ADMIN = gql`
    query ListAdminNotifications($input: ListNotificationsInput!) {
        listAdminNotifications(input: $input) {
            message
            notifications {
                _id
                createdAt
                updatedAt
                userId
                theme
                description
                readAt
                viewedAt
                isOpen
                themeAttributes {
                    attributes
                }
            }
            pagination {
                total
                hasNextPage
            }
            unreadCount
        }
    }
`;
