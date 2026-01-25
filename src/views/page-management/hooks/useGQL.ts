import { useMutation, useQuery } from '@apollo/client';
import {
    GET_USER_PROFILE,
    CREATE_PAGE_MUTATION,
    GET_ALL_PAGES,
    GET_PAGE_DETAIL,
    UPDATE_PAGE_MUTATION,
    REMOVE_PAGE_MUTATION
} from '../graphql';

import { PageManagement, PageManagementResponse } from '../types';
import { AdvancePageDto, CreateAdvancePageResponse } from '../types/gql/advancedPage';

export const useGQL = () => {
    const CREATE_PAGE = () => useMutation(CREATE_PAGE_MUTATION);


    const GET_ADMIN_PROFILE = () => useQuery(GET_USER_PROFILE);
    const GET_PAGES_LIST = () =>
        useQuery(GET_ALL_PAGES, {
            variables: {
                input: {}
            },
            notifyOnNetworkStatusChange: true
        });
    const GET_PAGE = (pageId: string) => useQuery(GET_PAGE_DETAIL, {
        variables: {
            pageId
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only'
    });
    const UPDATE_PAGE = () => useMutation(UPDATE_PAGE_MUTATION);
    const REMOVE_PAGE = () => useMutation(REMOVE_PAGE_MUTATION);
        

    return {
        CREATE_PAGE,
        UPDATE_PAGE,
        GET_ADMIN_PROFILE,
        GET_PAGES_LIST,
        GET_PAGE,
        REMOVE_PAGE
    };
};
