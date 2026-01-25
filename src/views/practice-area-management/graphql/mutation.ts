import { gql } from '@apollo/client';

export const CREATE_PAGE_MUTATION = gql`
    mutation CreatePracticeArea($body: CreatePracticeAreaInput!) {
        createPracticeArea(body: $body) {
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
    mutation UpdatePracticeArea($body: UpdatePracticeAreaInput!) {
        updatePracticeArea(body: $body) {
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
    mutation RemovePracticeArea($removePracticeAreaId: String!) {
        removePracticeArea(id: $removePracticeAreaId) {
            message
        }
    }
`;
