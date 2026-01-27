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
            }
            yearsOfExperience
            subTitle
            metaData {
                secondaryTitle
                secondarySubTitle
                items {
                    title
                    description
                }
                description
            }
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
            }
            yearsOfExperience
            subTitle
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

export const REMOVE_PAGE_MUTATION = gql`
    mutation RemovePage($removePageId: String!) {
        removePage(id: $removePageId) {
            message
        }
    }
`;
