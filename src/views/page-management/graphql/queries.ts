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
    query FindAllPages($input: GetAllPagesInputDTO!) {
        findAllPages(input: $input) {
            message
            pagination {
                total
                hasNextPage
            }
            data {
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
                author
            }
        }
    }
`;

export const GET_PAGE_DETAIL = gql`
    query Page($pageId: String!) {
        page(id: $pageId) {
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
