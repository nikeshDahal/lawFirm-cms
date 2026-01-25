import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_PRESIGNED_URL, GET_SETTINGS_LIST, UPDATE_SETTINGS as UPDATE  } from '../graphql';
import { PreSignedUrlInputDTO, PreSignedUrlResponse, SettingsResponse, UpdateSettingsDto } from '../types';

const useGQL = () => {
    const UPDATE_SETTINGS = () => useMutation<SettingsResponse, { input: { input: UpdateSettingsDto } }>(UPDATE);

    const GET_ALL_SETTINGS_LIST = () =>
        useQuery<SettingsResponse>(GET_SETTINGS_LIST, {
            fetchPolicy: 'network-only'
        });

        const IMAGE_UPLOAD = () => useLazyQuery(GET_PRESIGNED_URL);

    return { GET_ALL_SETTINGS_LIST, UPDATE_SETTINGS, IMAGE_UPLOAD };
};

export default useGQL;
