import { gql } from '@apollo/client';

export const REMOVE_FEEDBACK = gql`
    mutation DeleteByIdFeedback($deleteByIdFeedbackId: String!) {
        deleteByIdFeedback(id: $deleteByIdFeedbackId) {
            message
        }
    }
`;
