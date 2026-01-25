import { gql } from '@apollo/client';

export const CREATE_EMAIL_TEMPLATE = gql`
    mutation ($input: CreateEmailTemplateDTO!) {
        createEmailTemplate(input: $input) {
            message
            emailTemplate {
                _id
                title
                slug
                subject
                body
                createdAt
                updatedAt
                status
            }
        }
    }
`;

export const UPDATE_EMAIL_TEMPLATE = gql`
    mutation ($id: String!, $input: UpdateEmailTemplateDTO!) {
        updateEmailTemplate(id: $id, input: $input) {
            message
            emailTemplate {
                _id
                title
                slug
                subject
                body
                createdAt
                updatedAt
                status
            }
        }
    }
`;

export const REMOVE_EMAIL_TEMPLATE = gql`
    mutation ($id: String!) {
        removeEmailTemplate(id: $id) {
            message
        }
    }
`;
