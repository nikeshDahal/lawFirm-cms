import { SignedUrlMethod } from 'types/file-upload';
import { FileType } from 'types/menu';

const ImageUploadHelper = async (fileUploadParams) => {
    const { event, uploadFunction, filename } = fileUploadParams;
    const preSignedUrl = await uploadFunction({
        variables: {
            input: {
                path: filename,
                contentType: event.target.files[0].type,
                method: SignedUrlMethod.PUT
            }
        }
    });

    if (preSignedUrl?.data) {
        const response = await fetch(preSignedUrl.data.getPreSignedUrl.url, {
            method: SignedUrlMethod.PUT,
            body: event.target.files[0],
            headers: {
                'Content-Type': event.target.files[0].type
            }
        });

        if (response.ok) {
            const uploadResponse = await uploadFunction({
                variables: {
                    input: {
                        path: `temp/${filename}`,
                        contentType: event.target.files[0].type,
                        method: SignedUrlMethod.GET
                    }
                }
            });

            const fileDetails: FileType = {
                name: filename,
                objectKey: `temp/${filename}`,
                contentType: event.target.files[0].type
            };

            return { uploadResponse, fileDetails };
        }
    }
};

export default ImageUploadHelper;
