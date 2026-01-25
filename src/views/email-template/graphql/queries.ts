import { gql } from '@apollo/client';

export const GET_ALL_EMAIL_TEMPLATES = gql`
    query ($input: GetEmailTemplateDTO!) {
        getAllEmailTemplates(input: $input) {
            message
            emailTemplates {
                _id
                title
                slug
                subject
                status
                body
                createdAt
                updatedAt
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;

export const GET_EMAIL_TEMPLATE = gql`
    query ($id: String!) {
        getEmailTemplate(id: $id) {
            message
            emailTemplate {
                _id
                title
                slug
                subject
                status
                body
                createdAt
                updatedAt
            }
        }
    }
`;

export const VIEW_EMAIL_TEMPLATE = gql`
    query ($input: String!) {
        readEmailTemplate(input: $input) {
            template
        }
    }
`;
