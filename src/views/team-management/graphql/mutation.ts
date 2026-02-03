import { gql } from '@apollo/client';

export const CREATE_TEAM_MUTATION = gql`
    mutation CreateTeam($body: CreateTeamInput!) {
        createTeam(body: $body) {
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
                practiceArea
                profileImage
                status
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

export const UPDATE_TEAM_MUTATION = gql`
    mutation UpdateTeam($body: UpdateTeamInput!) {
        updateTeam(body: $body) {
            message
            page {
                _id
                createdAt
                updatedAt
                name
                designation
                practiceArea
                profileImage
                status
            }
        }
    }
`;

export const REMOVE_TEAM_MUTATION = gql`
    mutation RemoveTeam($removeTeamId: String!) {
        removeTeam(id: $removeTeamId) {
            message
        }
    }
`;
