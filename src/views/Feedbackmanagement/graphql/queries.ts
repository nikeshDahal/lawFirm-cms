import { gql } from '@apollo/client';

export const GET_FEEDBACK_LIST = gql`
    query FindAllFeedback($input: ListFeedbackInput!) {
        findAllFeedback(input: $input) {
            message
            pagination {
                total
                hasNextPage
            }
            feedbacks {
                _id
                createdAt
                updatedAt
                title
                image
                message
                user {
                    _id
                    fullName
                    email
                }
            }
        }
    }
`;
export const GET_FEEDBACK = gql`
    query FindByIdFeedback($findByIdFeedbackId: String!) {
        findByIdFeedback(id: $findByIdFeedbackId) {
            message
            feedback {
                _id
                createdAt
                updatedAt
                title
                image
                message
                user {
                    _id
                    fullName
                    email
                }
                imageUrl
            }
        }
    }
`;
