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
                contactInfo {
                    primaryEmail
                    secondaryEmail
                    primaryPhone
                    secondaryPhone
                }
                socialMedia {
                    facebook
                    instagram
                    linkedIn
                    youtube
                    tiktok
                    twitter
                }
                location {
                    label
                    address
                    city
                    country
                }
                officeHour {
                    day
                    note
                }
                recognitions {
                    title
                    subtitle
                    description
                    icon
                }
                subTitle
                yearsOfExperience
                metaData {
                    secondaryTitle
                    secondarySubTitle
                    description
                    items {
                        title
                        description
                    }
                }
            }
        }
    }
`;

export const GET_PAGE_DETAIL = gql`
    query Page($pageId: String) {
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
            author
            contactInfo {
                primaryEmail
                secondaryEmail
                primaryPhone
                secondaryPhone
            }
            socialMedia {
                facebook
                instagram
                linkedIn
                youtube
                tiktok
                twitter
            }
            location {
                label
                address
                city
                country
            }
            officeHour {
                day
                note
            }
            recognitions {
                title
                subtitle
                description
                icon
            }
            subTitle
            yearsOfExperience
            metaData {
                secondaryTitle
                secondarySubTitle
                description
                items {
                    title
                    description
                }
            }
        }
    }
`;
