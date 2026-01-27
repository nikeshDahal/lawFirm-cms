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
    query FindAllPracticeAreas($input: GetAllPracticeAreasInputDTO!) {
        findAllPracticeAreas(input: $input) {
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
    query FindPracticeAreaById($findPracticeAreaByIdId: String) {
        findPracticeAreaById(id: $findPracticeAreaByIdId) {
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
                seoTags {
                    title
                    description
                    tags
                }
            }
        }
    }
`;
