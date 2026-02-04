import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_PROFILE, CREATE_FAQ_MUTATION, GET_ALL_FAQS, GET_FAQ_DETAIL, UPDATE_FAQ_MUTATION, REMOVE_FAQ_MUTATION } from '../graphql';

export const useGQL = () => {
    const CREATE_FAQ = () => useMutation(CREATE_FAQ_MUTATION);

    const GET_ADMIN_PROFILE = () => useQuery(GET_USER_PROFILE);
    const GET_FAQS_LIST = () =>
        useQuery(GET_ALL_FAQS, {
            variables: {
                input: { limit: 100, skip: 0 }
            },
            notifyOnNetworkStatusChange: true
        });
    const GET_FAQ = (faqId: string) =>
        useQuery(GET_FAQ_DETAIL, {
            variables: {
                getFaqByIdId: faqId
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only'
        });
    const UPDATE_FAQ = () => useMutation(UPDATE_FAQ_MUTATION);
    const REMOVE_FAQ = () => useMutation(REMOVE_FAQ_MUTATION);

    return {
        CREATE_FAQ,
        UPDATE_FAQ,
        GET_ADMIN_PROFILE,
        GET_FAQS_LIST,
        GET_FAQ_BY_ID: GET_FAQ,
        REMOVE_FAQ
    };
};
