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

export const GET_ALL_PAGES = gql`
    query FindAllTestimonials($input: GetAllTestimonialsInputDTO!) {
        findAllTestimonials(input: $input) {
            message
            pagination {
                total
                hasNextPage
            }
            data {
                _id
                createdAt
                updatedAt
                message
                rating
                clientName
                clientDesignation
                clientImage
                status
            }
        }
    }
`;

export const GET_PAGE_DETAIL = gql`
    query FindTestimonialById($findTestimonialByIdId: String!) {
        findTestimonialById(id: $findTestimonialByIdId) {
            message
            page {
                _id
                createdAt
                updatedAt
                message
                rating
                clientName
                clientDesignation
                clientImage
                status
            }
        }
    }
`;
