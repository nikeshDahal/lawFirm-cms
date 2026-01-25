import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Admin, AdminResponse, OTPAuthUrlResponse, UserProfileResponse, VerifyOTPAuthUrlResponse } from '../../../types/profile';
import { UPDATE_ADMIN } from 'views/user-management/admins/graphql';

import { CHANGE_PASSWORD, GET_USER_PROFILE, GET_PRESIGNED_URL, GET_AUTH_URL, VERIFY_OTP, LOGOUT_ADMIN, UPDATE2FAGQL } from '../graphql';
import { DashboardResponse, NotificationAdminResponse } from 'views/NotificationManagement/constants/types';

export const useGQL = () => {
    const ADMIN_CHANGE_PASSWORD = () => useMutation(CHANGE_PASSWORD);
    const GET_ADMIN_PROFILE = () => useQuery<UserProfileResponse>(GET_USER_PROFILE, { fetchPolicy: 'no-cache' });

    const UPDATE_ADMIN_PROFILE = () => useMutation<AdminResponse, { id: string; input: Partial<Admin> }>(UPDATE_ADMIN);
    const IMAGE_UPLOAD = () => useLazyQuery(GET_PRESIGNED_URL);
    const GET_OTP_AUTH_URL = (skipCondition) => useQuery<OTPAuthUrlResponse>(GET_AUTH_URL, { skip: skipCondition });
    const VERIFY_AUTH_OTP = () => useMutation<VerifyOTPAuthUrlResponse, { token: string }>(VERIFY_OTP);
    const UPDATE2FA = () => useMutation(UPDATE2FAGQL);
    const LOGOUT = () => useMutation(LOGOUT_ADMIN);
    return {
        ADMIN_CHANGE_PASSWORD,
        GET_ADMIN_PROFILE,
        UPDATE_ADMIN_PROFILE,
        IMAGE_UPLOAD,
        GET_OTP_AUTH_URL,
        VERIFY_AUTH_OTP,
        UPDATE2FA,
        LOGOUT
    };
};
