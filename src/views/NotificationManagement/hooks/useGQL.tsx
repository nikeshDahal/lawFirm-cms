import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { DashboardResponse, NotificationAdminResponse } from '../constants/types';
import { DELETE_NOTIFICATION, GET_NOTIFICATIONS_FOR_ADMIN } from '../graphql';
import { MARK_ALL_SEEN_NOTIFICATION, MARK_AS_SEEN_NOTIFICATION } from 'views/profile/graphql/mutations';

export const useGQL = () => {
    const GET_NOTIFICATIONS_ADMIN = () => useQuery<DashboardResponse>(GET_NOTIFICATIONS_FOR_ADMIN);

    const GET_NOTIFICATIONS = (onCompleted?: (data: any) => void) =>
        useLazyQuery<NotificationAdminResponse>(GET_NOTIFICATIONS_FOR_ADMIN, {
            variables: {
                input: {}
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only'
        });

    const MARK_AS_SEEN = () => useMutation<DashboardResponse, { notificationId: string }>(MARK_AS_SEEN_NOTIFICATION);

    const MARK_All_AS_SEEN = () => useMutation<DashboardResponse>(MARK_ALL_SEEN_NOTIFICATION);
    const DELETE_NOTIFICATIONS = () => useMutation<DashboardResponse>(DELETE_NOTIFICATION);

    return {
        GET_NOTIFICATIONS_ADMIN,
        MARK_AS_SEEN,
        GET_NOTIFICATIONS,
        MARK_All_AS_SEEN,
        DELETE_NOTIFICATIONS
    };
};
