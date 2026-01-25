import { gql } from '@apollo/client';

export const GET_ADMIN_LIST = gql`
    query ($input: GetAdminListDTO!) {
        getAdminList(input: $input) {
            message
            adminList {
                _id
                firstName
                lastName
                email
                phone
                status
                role
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;

export const GET_ADMIN = gql`
    query ($id: String!) {
        getAdmin(id: $id) {
            message
            admin {
                _id
                firstName
                lastName
                email
                role
                status
                phone
            }
        }
    }
`;

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
