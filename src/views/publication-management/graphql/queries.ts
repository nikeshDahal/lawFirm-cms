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
    query FindAllPublications($input: GetAllPublicationsInputDTO!) {
        findAllPublications(input: $input) {
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
                pageImage
                metaData
            }
        }
    }
`;

export const GET_PAGE_DETAIL = gql`
    query FindPublicationById($findPublicationByIdId: String!) {
        findPublicationById(id: $findPublicationByIdId) {
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
