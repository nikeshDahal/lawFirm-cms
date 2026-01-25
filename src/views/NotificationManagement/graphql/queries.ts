import { gql } from '@apollo/client';

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
