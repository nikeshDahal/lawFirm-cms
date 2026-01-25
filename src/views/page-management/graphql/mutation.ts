import { gql } from '@apollo/client';

export const CREATE_PAGE_MUTATION = gql`
    mutation CreatePage($body: CreatePageInput!) {
        createPage(body: $body) {
            _id
            createdAt
            updatedAt
            title
            slug
            content
            status
            seoTags {
                title
                description
                tags
            }
            pageType
        }
    }
`;

export const UPDATE_PAGE_MUTATION = gql`
    mutation UpdatePage($body: UpdatePageInput!) {
        updatePage(body: $body) {
            _id
            createdAt
            updatedAt
            title
            slug
            content
            status
            seoTags {
                title
                description
                tags
            }
            pageType
        }
    }
`;

export const REMOVE_PAGE_MUTATION = gql`
    mutation RemovePage($removePageId: String!) {
        removePage(id: $removePageId) {
            message
        }
    }
`;
