import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
    CREATE_TASK_TEMPLATE,
    GET_ALL_PRESET_TEMPLATES,
    GET_PRESET_TEMPLATE,
    REMOVE_IMAGE,
    REMOVE_TASK_TEMPLATE,
    UPDATE_TASK_TEMPLATE,
    GET_ALL_CATEGORIES
} from '../graphql';
import { CreateTemplateInput, DeletePresetTemplate, GetPresetTemplateDTO, IdInput, PresetTemplateResponse } from '../constants/types';
import { GET_PRESIGNED_URL } from 'views/profile/graphql';

export const useGQL = () => {
    const GET_TEMPLATES_LIST = () =>
        useQuery<PresetTemplateResponse, { input: Partial<GetPresetTemplateDTO> }>(GET_ALL_PRESET_TEMPLATES, {
            variables: { input: {} },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only'
        });

    const IMAGE_UPLOAD = () => useLazyQuery(GET_PRESIGNED_URL);

    const GET_TEMPLATE = (id: string) =>
        useQuery<PresetTemplateResponse, { input: IdInput }>(GET_PRESET_TEMPLATE, {
            variables: { input: { id } },
            notifyOnNetworkStatusChange: true
        });

    const CREATE_TEMPLATE = () => useMutation<PresetTemplateResponse, { input: CreateTemplateInput }>(CREATE_TASK_TEMPLATE);

    const UPDATE_TEMPLATE = () => useMutation<PresetTemplateResponse, { input: Partial<CreateTemplateInput> }>(UPDATE_TASK_TEMPLATE);

    const REMOVE_TASK = () => useMutation<PresetTemplateResponse, { input: DeletePresetTemplate }>(REMOVE_TASK_TEMPLATE);

    const DELETE_IMAGE = () => useMutation<PresetTemplateResponse, { templateId: string; index: number }>(REMOVE_IMAGE);

    const GET_ALL_CATEGORY = () =>
        useQuery(GET_ALL_CATEGORIES, {
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only'
        });

    return {
        DELETE_IMAGE,
        GET_TEMPLATES_LIST,
        REMOVE_TASK,
        IMAGE_UPLOAD,
        CREATE_TEMPLATE,
        GET_TEMPLATE,
        UPDATE_TEMPLATE,
        GET_ALL_CATEGORY
    };
};
