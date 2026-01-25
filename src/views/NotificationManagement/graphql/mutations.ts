import { gql } from '@apollo/client';

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

export const DELETE_NOTIFICATION = gql`
    mutation DeleteNotifications($ids: [String!]!) {
        deleteNotifications(ids: $ids) {
            message
        }
    }
`;
