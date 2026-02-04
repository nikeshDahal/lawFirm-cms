import { gql } from '@apollo/client';

export const CREATE_FAQ_MUTATION = gql`
    mutation Createfaq($body: CreateFaqInput!) {
        createfaq(body: $body) {
            message
            page {
                _id
                items {
                    question
                    answer
                    status
                }
            }
        }
    }
`;

export const UPDATE_FAQ_MUTATION = gql`
    mutation Updatefaq($body: UpdateFaqInput!) {
        updatefaq(body: $body) {
            message
            page {
                _id
                items {
                    question
                    answer
                    status
                }
            }
        }
    }
`;

export const REMOVE_FAQ_MUTATION = gql`
    mutation Removefaq($removeFaqId: String!) {
        removefaq(id: $removeFaqId) {
            message
        }
    }
`;
