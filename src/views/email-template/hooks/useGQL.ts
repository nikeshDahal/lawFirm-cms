import { useMutation, useQuery } from '@apollo/client';
import {
    CREATE_EMAIL_TEMPLATE,
    REMOVE_EMAIL_TEMPLATE,
    UPDATE_EMAIL_TEMPLATE,
    GET_ALL_EMAIL_TEMPLATES,
    GET_EMAIL_TEMPLATE,
    VIEW_EMAIL_TEMPLATE
} from '../graphql';
import { GetEmailTemplateDTO, EmailTemplateResponse, CreateEmailTemplateDTO, TemplateResponse } from '../types';

export const useGQL = () => {
    const GET_TEMPLATES_LIST = () =>
        useQuery<EmailTemplateResponse, { input: Partial<GetEmailTemplateDTO> }>(GET_ALL_EMAIL_TEMPLATES, {
            variables: { input: {} },
            notifyOnNetworkStatusChange: true
        });
    const GET_TEMPLATE = (id: string) =>
        useQuery<EmailTemplateResponse, { id: string }>(GET_EMAIL_TEMPLATE, { variables: { id }, notifyOnNetworkStatusChange: true });
    const VIEW_TEMPLATE = (input: string) =>
        useQuery<TemplateResponse, { input: string }>(VIEW_EMAIL_TEMPLATE, { variables: { input }, notifyOnNetworkStatusChange: true });
    const CREATE_TEMPLATE = () => useMutation<EmailTemplateResponse, { input: CreateEmailTemplateDTO }>(CREATE_EMAIL_TEMPLATE);

    const UPDATE_TEMPLATE = () =>
        useMutation<EmailTemplateResponse, { id: string; input: Partial<CreateEmailTemplateDTO> }>(UPDATE_EMAIL_TEMPLATE);

    const REMOVE_TEMPLATE = () => useMutation<EmailTemplateResponse, { id: string }>(REMOVE_EMAIL_TEMPLATE);

    return { GET_TEMPLATES_LIST, GET_TEMPLATE, CREATE_TEMPLATE, UPDATE_TEMPLATE, REMOVE_TEMPLATE, VIEW_TEMPLATE };
};
