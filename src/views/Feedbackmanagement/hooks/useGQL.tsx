import { useMutation, useQuery } from '@apollo/client';
import { FeedbackResponseType } from '../constants/types';
import { GET_FEEDBACK, GET_FEEDBACK_LIST } from '../graphql';
import { REMOVE_FEEDBACK } from '../graphql/mutations';
export const useGQL = () => {
    const GET_FEEDBACK_LIST_GQL = () =>
        useQuery<FeedbackResponseType>(GET_FEEDBACK_LIST, {
            variables: {
                input: {}
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only'
        });
    const GET_FEEDBACK_GQL = (id: string) =>
        useQuery<FeedbackResponseType, { findByIdFeedbackId: string }>(GET_FEEDBACK, {
            variables: { findByIdFeedbackId: id },
            notifyOnNetworkStatusChange: true
        });

    const REMOVE_FEEDBACK_GQL = () => useMutation<FeedbackResponseType, { deleteByIdFeedbackId: string }>(REMOVE_FEEDBACK);

    return {
        GET_FEEDBACK_LIST_GQL,
        GET_FEEDBACK_GQL,
        REMOVE_FEEDBACK_GQL
    };
};
