import { SignedUrlMethod } from 'types/file-upload';
import { FileType } from 'types/menu';

const blobUploadHelperPublic = async (blobData, uploadFunction, filename, contentType) => {
    console.log('contentType', contentType);
    const data = await uploadFunction({
        variables: {
            input: {
                path: filename,
                contentType,
                method: SignedUrlMethod.PUT
            }
        }
    });
    console.log('data?.getAwsPubicUploadPresignedUrl?.url', data?.data?.getAwsPubicUploadPresignedUrl?.url);
    if (data?.data?.getAwsPubicUploadPresignedUrl?.url) {
        const response = await fetch(data?.data?.getAwsPubicUploadPresignedUrl?.url, {
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

export default blobUploadHelperPublic;
