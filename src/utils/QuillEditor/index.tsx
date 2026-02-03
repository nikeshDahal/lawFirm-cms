import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { debounce } from 'lodash';

import Quill from 'quill';
import ImageUploader from 'quill-image-uploader';
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import { GET_PRESIGNED_URL } from 'views/profile/graphql';
import { useApolloClient } from '@apollo/client';
import { SignedUrlMethod } from 'types/file-upload';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageUploader', ImageUploader);
Quill.register('modules/imageResize', ImageResize);

const QuillEditor = ({ value, setFieldValue, fieldName }) => {
    const client = useApolloClient();
    const theme = useTheme();

    // Debounce editor changes
    const debounceEditorChange = useMemo(() => debounce((content) => setFieldValue(fieldName, content), 300), [setFieldValue, fieldName]);

    useEffect(() => {
        return () => debounceEditorChange.cancel();
    }, [debounceEditorChange]);

    // Image upload handler using GraphQL + presigned URL
    const imageUploadHandler = async (file) => {
        try {
            // 1️⃣ Request presigned URL from GraphQL backend
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

            // 2️⃣ Upload file to S3 (PUT)
            const response = await fetch(uploadUrl, {
                method: SignedUrlMethod.PUT,
                headers: { 'Content-Type': file.type },
                body: file
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }
            console.log('Image uploaded successfully', response);

            // 3️⃣ Generate public URL for editor
            const publicUrl = uploadUrl.split('?')[0];

            console.log('Public URL:', publicUrl);

            // 4️⃣ Return URL to Quill editor
            return publicUrl;
        } catch (err) {
            console.error('Image upload failed:', err);
            throw new Error('Image upload failed');
        }
    };

    const modules = useMemo(
        () => ({
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block', 'link', 'clean'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ align: [] }],
                [{ color: [] }, { background: [] }],
                ['image']
            ],
            history: { delay: 1000, maxStack: 100, userOnly: true },

            imageUploader: { upload: imageUploadHandler },
            imageResize: { modules: ['Resize', 'DisplaySize', 'Toolbar', 'Align'] }
        }),
        []
    );

    return (
        <Stack
            sx={{
                '& .quill': {
                    bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'background.paper',
                    borderRadius: 0,
                    '& .ql-toolbar': {
                        bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : 'grey.400'
                    },
                    '& .ql-container': {
                        borderColor: theme.palette.mode === 'dark' ? `${theme.palette.dark.light + 20} !important` : 'grey.400',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        '& .ql-editor': { minHeight: 200 }
                    },
                    '& .ql-editor': {
                        ...theme.typography.body1,
                        color: 'grey.900'
                    },
                    '& .ql-editor.ql-blank::before': {
                        ...theme.typography.body1,
                        color: 'grey.500',
                        opacity: 0.42
                    }
                }
            }}
        >
            <ReactQuill
                value={value}
                onChange={(content) => debounceEditorChange(content)}
                placeholder="Enter page content here..."
                modules={modules}
            />
        </Stack>
    );
};

export default QuillEditor;
