import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
    query {
        getUserProfile {
            _id
            firstName
            lastName
            email
            phone
            status
            role
            profileImage
            profileImageUrl
        }
    }
`;

export const GET_ALL_FAQS = gql`
    query FindAllfaqs($input: GetAllFaqInputDTO!) {
        findAllfaqs(input: $input) {
            message
            pagination {
                total
                hasNextPage
            }
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

export const GET_FAQ_DETAIL = gql`
    query GetFaqById($getFaqByIdId: String!) {
        getFaqById(id: $getFaqByIdId) {
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
