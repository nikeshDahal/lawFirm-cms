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
            imageAltText
            profileImage
            imageAltTextUrl
        }
    }
`;

export const GET_ALL_TEAMS = gql`
    query FindAllTeams($input: GetAllTeamsInputDTO!) {
        findAllTeams(input: $input) {
            message
            pagination {
                total
                hasNextPage
            }
            data {
                _id
                createdAt
                updatedAt
                name
                slug
                designation
                status
                practiceArea
                profileImage
            imageAltText
                about
                experiences
                qualifications
                languages
                others
                seoTags {
      title
      description
      tags
      schemaMarkup
    }
                socialLinks {
                    facebook
                    email
                    linkedIn
                    twitter
                    contactNumber
                }
            }
        }
    }
`;

export const GET_TEAM_DETAIL = gql`
    query FindTeamById($findTeamByIdId: String!) {
        findTeamById(id: $findTeamByIdId) {
            message
            page {
                _id
                createdAt
                updatedAt
                name
                slug
                designation
                status
                practiceArea
                profileImage
            imageAltText
                experiences
                qualifications
                languages
                others
                about
                seoTags {
      title
      description
      tags
      schemaMarkup
    }
                socialLinks {
                    facebook
                    email
                    linkedIn
                    twitter
                    contactNumber
                }
            }
        }
    }
`;
