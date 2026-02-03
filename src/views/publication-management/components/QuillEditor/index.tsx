'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

// project imports
import { useEffect, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { debounce } from 'lodash';

// quill image uploader imports
import ImageUploader from 'quill-image-uploader';
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import Quill from 'quill';

// Register the Quill Image Uploader module
Quill.register('modules/imageUploader', ImageUploader);

const QuillEditor = ({ value, setFieldValue, fieldName }) => {
    const theme = useTheme();
    const fileInputRef = useRef(null);

    const debounceEditorChange = useMemo(
        () =>
            debounce((content) => {
                setFieldValue(fieldName, content);
            }, 300),
        [setFieldValue, fieldName]
    );

    useEffect(() => {
        return () => {
            debounceEditorChange.cancel();
        };
    }, [debounceEditorChange]);

    // Image upload handler
    const imageUploadHandler = (file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file);

            // Example: Upload image to server
            fetch('/upload-image', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                resolve(result.url); // Return the uploaded image URL to the editor
            })
            .catch(error => {
                console.error('Error:', error);
                reject("Upload failed");
            });
        });
    };

    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['image'], // Image button
            ['clean']
        ],
        imageUploader: {
            upload: imageUploadHandler
        }
    }), []);

    return (
        <Stack
            sx={{
                '& .quill': {
                    bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'background.paper',
                    borderRadius: '0',
                    '& .ql-toolbar': {
                        bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : 'grey.400',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0'
                    },
                    '& .ql-container': {
                        borderColor: theme.palette.mode === 'dark' ? `${theme.palette.dark.light + 20} !important` : 'grey.400',
                        borderBottomLeftRadius: '0',
                        borderBottomRightRadius: '0',
                        '& .ql-editor': {
                            minHeight: 135
                        }
                    },
                    '& .ql-editor': {
                        ...theme.typography.body1,
                        color: 'grey.900',
                    },
                    '& .ql-editor.ql-blank::before': {
                        ...theme.typography.body1,
                        fontStyle: 'normal',
                        color: 'grey.500',
                        opacity: 0.42
                    }
                }
            }}
        >
            <ReactQuill
                value={value}
                onChange={(content) => debounceEditorChange(content)}
                placeholder="Enter page content here"
                modules={modules}
            />
        </Stack>
    );
};

export default QuillEditor;
