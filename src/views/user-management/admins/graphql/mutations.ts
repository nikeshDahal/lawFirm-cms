import { gql } from '@apollo/client';

export const REGISTER = gql`
    mutation ($input: CreateAdminDTO!) {
        register(input: $input) {
            _id
            firstName
            lastName
            email
            status
            role
            phone
        }
    }
`;

export const UPDATE_ADMIN = gql`
    mutation ($id: String!, $input: UpdateAdminDTO!) {
        updateAdmin(id: $id, input: $input) {
            message
            admin {
                _id
                firstName
                lastName
                email
                status
                role
                phone
            }
        }
    }
`;

export const DELETE_ADMIN = gql`
    mutation ($id: String!) {
        removeAdmin(id: $id) {
            message
            admin {
                _id
            }
        }
    }
`;

export const UPDATE_ADMIN_STATUS_MUTATION = gql`
mutation UpdateAdminStatus($input: UpdateAdminStatusInput!) {
  updateAdminStatus(input: $input) {
    message
  }
}
`
export const SEND_ADMIN_RESET_PASSWORD_MAIL = gql`
    mutation ($email: String!, $name: String!, $userId: String!) {
        sendAdminPasswordResetMail(email: $email, name: $name, userId: $userId)
    }
`;


// export const SEND_RESET_PASSWORD_MAIL = gql`
//     mutation ($email: String!, $name: String!, $userId: String!) {
//         sendPasswordResetMail(email: $email, name: $name, userId: $userId)
//     }
// `;