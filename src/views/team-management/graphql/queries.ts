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
                designation
                status
                practiceArea
                profileImage
                socialLinks {
                    facebook
                    email
                    linkedIn
                    twitter
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
                designation
                status
                practiceArea
                profileImage
                socialLinks {
                    facebook
                    email
                    linkedIn
                    twitter
                }
            }
        }
    }
`;
