import { gql } from '@apollo/client';

export const UPDATE_SETTINGS = gql`
    mutation ($input: UpdateSettingsDto!) {
        updateSettings(input: $input) {
            message
            settings {
                _id
                title
                slug
                description
                fieldType
                order
                options {
                    label
                    value
                }
                value
                values
                updatedAt
                createdAt
            }
        }
    }
`;