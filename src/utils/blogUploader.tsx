import { SignedUrlMethod } from 'types/file-upload';
import { FileType } from 'types/menu';

const blobUploadHelper = async (blobData, uploadFunction, filename, contentType) => {
    const preSignedUrl = await uploadFunction({
        variables: {
            input: {
                path: filename,
                contentType,
                method: SignedUrlMethod.PUT
            }
        }
    });

    if (preSignedUrl?.data) {
        const response = await fetch(preSignedUrl.data.getPreSignedUrl.url, {
            method: SignedUrlMethod.PUT,
            body: blobData,
            headers: {
                'Content-Type': contentType
            }
        });

        if (response.ok) {
            const uploadResponse = await uploadFunction({
                variables: {
                    input: {
                        path: filename,
                        contentType: contentType,
                        method: SignedUrlMethod.GET
                    }
                }
            });

            const fileDetails: FileType = {
                name: filename,
                objectKey: `${filename}`,
                contentType: contentType
            };

            return { uploadResponse, fileDetails };
        }
    }
};

export default blobUploadHelper;
