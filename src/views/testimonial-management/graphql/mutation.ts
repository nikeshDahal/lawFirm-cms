import { gql } from '@apollo/client';

export const CREATE_PAGE_MUTATION = gql`
    mutation CreateTestimonial($body: CreateTestimonialInput!) {
        createTestimonial(body: $body) {
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
            message
        }
    }
`;

export const UPDATE_PAGE_MUTATION = gql`
    mutation UpdateTestimonial($body: UpdateTestimonialInput!) {
        updateTestimonial(body: $body) {
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

export const REMOVE_PAGE_MUTATION = gql`
    mutation RemoveTestimonial($removeTestimonialId: String!) {
        removeTestimonial(id: $removeTestimonialId) {
            message
        }
    }
`;
