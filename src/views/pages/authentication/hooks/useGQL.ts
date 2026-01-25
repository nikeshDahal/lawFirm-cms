import { useMutation, useQuery } from '@apollo/client';
import {
    APP_USER_RESET_PASSWORD,
    CODE_VERIFICATION,
    FORGOT_PASSWORD,
    LOGIN,
    REGISTER,
    RESEND_OTP_CODE,
    RESET_PASSWORD,
    VALIDATE_OTP,
    VERIFY_TOKEN,
    GET_SETTINGS_LIST
} from '../graphql';
import { SettingsResponse } from '../types';

const useGQL = () => {
    const APP_USER_RESET_PASS = () => useMutation(APP_USER_RESET_PASSWORD);
    const ADMIN_LOGIN = () => useMutation(LOGIN);
    const CODE_VERIFY = () => useMutation(CODE_VERIFICATION);
    const RESEND_CODE = () => useMutation(RESEND_OTP_CODE);
    const ADMIN_REGISTER = () => useMutation(REGISTER);
    const FORGOT_PASS = () => useMutation(FORGOT_PASSWORD);
    const RESET_PASS = () => useMutation(RESET_PASSWORD);
    const TOKEN_VERIFY = () => useMutation(VERIFY_TOKEN);
    const VALIDATE_AUTH_OTP = () => useMutation(VALIDATE_OTP);

    const GET_ALL_SETTINGS_LIST = () =>
        useQuery<SettingsResponse>(GET_SETTINGS_LIST, {
            fetchPolicy: 'network-only'
        });
    return {
        APP_USER_RESET_PASS,
        ADMIN_LOGIN,
        CODE_VERIFY,
        RESEND_CODE,
        ADMIN_REGISTER,
        FORGOT_PASS,
        RESET_PASS,
        TOKEN_VERIFY,
        VALIDATE_AUTH_OTP,
        GET_ALL_SETTINGS_LIST
    };
};
export default useGQL;
