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

export const GET_PRESIGNED_URL = gql`query GetPreSignedUrl($input: PreSignedUrlInput!) {
    getPreSignedUrl(input: $input) {
      message
      url
    }
  }`