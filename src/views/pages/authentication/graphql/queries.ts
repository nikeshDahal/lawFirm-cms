import { gql } from '@apollo/client';

export const GET_SETTINGS_LIST = gql`
    query {
        listSettings {
            message
            settings {
                _id
                title
                slug
                description
                fieldType
                order
                options
                value
                values
                updatedAt
                createdAt
            }
        }
    }
`;
