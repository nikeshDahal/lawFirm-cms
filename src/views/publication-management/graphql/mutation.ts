import { gql } from '@apollo/client';

export const CREATE_PAGE_MUTATION = gql`
    mutation CreatePublication($body: CreatePublicationInput!) {
        createPublication(body: $body) {
            message
            page {
                _id
                createdAt
                updatedAt
                title
                slug
                content
                status
                pageType
                author
                pageImage
                metaData
            }
        }
    }
`;

export const UPDATE_PAGE_MUTATION = gql`
    mutation UpdatePublication($body: UpdatePublicationInput!) {
        updatePublication(body: $body) {
            message
            page {
                _id
                createdAt
                updatedAt
                title
                slug
                content
                status
                pageType
                author
                pageImage
                metaData
            }
        }
    }
`;

export const REMOVE_PAGE_MUTATION = gql`
    mutation RemovePublication($removePublicationId: String!) {
        removePublication(id: $removePublicationId) {
            message
        }
    }
`;
