import { ApolloClient } from '@apollo/client';
import { SignedUrlMethod } from 'types/file-upload';
import { GET_PRESIGNED_URL } from 'views/profile/graphql';

export type UploadResult = {
    publicUrl: string;
    fileKey: string;
};

export const uploadImage = async (client: ApolloClient<any>, file: File, options?: { maxSizeMB?: number }): Promise<UploadResult> => {
    const maxSizeMB = options?.maxSizeMB ?? 5;
    const fileSize = file.size / (1024 * 1024);

    if (fileSize > maxSizeMB) {
        throw new Error(`File too large. Max size: ${maxSizeMB}MB`);
    }

    const { data } = await client.query({
        query: GET_PRESIGNED_URL,
        variables: {
            input: {
                path: file.name,
                contentType: file.type,
                method: SignedUrlMethod.PUT
            }
        }
    });

    const uploadUrl = data?.getPreSignedUrl?.url;

    if (!uploadUrl) throw new Error('Presigned URL not returned');

    const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
    });

    if (!uploadRes.ok) throw new Error('Upload to S3 failed');

    const publicUrl = uploadUrl.split('?')[0];

    return { publicUrl, fileKey: file.name };
};
