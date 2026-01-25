import axios from 'axios';
import invariant from 'tiny-invariant';

export const uploadFile = async (file: File) => {
    return new Promise<string>((res, rej) => {
        const formData = new FormData();
        formData.append('file', file);

        invariant(import.meta.env.VITE_APP_UPLOAD_PRESET, 'Upload preset not empty');
        formData.append('upload_preset', import.meta.env.VITE_APP_UPLOAD_PRESET);

        /* api call to cdn */

        invariant(import.meta.env.VITE_APP_CLOUDINARY_API, 'URI not empty');
        axios
            .post(import.meta.env.VITE_APP_CLOUDINARY_API, formData, {
                onUploadProgress: (progressEvent: any) => {
                    /* can be used to track upload % */
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                }
            })
            .then((response) => {
                res(response.data.secure_url);
            })
            .catch((error) => rej(error));
    });
};
