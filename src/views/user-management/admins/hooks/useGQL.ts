import { useMutation, useQuery } from '@apollo/client';
import {
    GET_ADMIN_LIST,
    DELETE_ADMIN as ADMIN_DELETE,
    GET_USER_PROFILE,
    GET_ADMIN as ADMIN,
    UPDATE_ADMIN as ADMIN_UPDATE,
    UPDATE_ADMIN_STATUS_MUTATION,
    //SEND_RESET_PASSWORD_MAIL,
    REGISTER,
    SEND_ADMIN_RESET_PASSWORD_MAIL
} from '../graphql';

type GetAdminListDTO = {
    searchText?: string;
    orderBy?: string;
    order?: string;
    limit?: number;
    skip?: number;
};

const useGQL = () => {

    /* admins */
    const GET_ALL_ADMINS = (input: GetAdminListDTO = {}) => useQuery(GET_ADMIN_LIST, { variables: { input } });
    const GET_ADMIN = (id: String) => useQuery(ADMIN, { variables: { id } });
    const UPDATE_ADMIN = () => useMutation(ADMIN_UPDATE);
    const DELETE_ADMIN = () => useMutation(ADMIN_DELETE);
    const GET_ADMIN_PROFILE = () => useQuery(GET_USER_PROFILE);
    const UPDATE_ADMIN_STATUS = () => useMutation(UPDATE_ADMIN_STATUS_MUTATION);

    const ADMIN_REGISTER = () => useMutation(REGISTER);

    // const SEND_PASSWORD_RESET_MAIL = () => useMutation(SEND_RESET_PASSWORD_MAIL);
    const SEND_ADMIN_PASSWORD_RESET_MAIL = () => useMutation(SEND_ADMIN_RESET_PASSWORD_MAIL);

    return {
        GET_ADMIN,
        UPDATE_ADMIN,
        GET_ALL_ADMINS,
        GET_ADMIN_PROFILE,
        DELETE_ADMIN,
        UPDATE_ADMIN_STATUS,

        ADMIN_REGISTER,
        SEND_ADMIN_PASSWORD_RESET_MAIL
        // SEND_PASSWORD_RESET_MAIL
    };
};
export default useGQL;
