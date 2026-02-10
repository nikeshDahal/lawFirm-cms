import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useApolloClient } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import { GET_PRESIGNED_URL } from 'views/profile/graphql';
import { SignedUrlMethod } from 'types/profile';

// import { GET_PRESIGNED_URL } from "graphql/queries";
// import { SignedUrlMethod } from "constants";

const TinyMCEEditor = ({ value, setFieldValue, fieldName }) => {
    const client = useApolloClient();
    const theme = useTheme();

    // 🔴 REQUIRED: Image upload handler
    const imageUploadHandler = async (file) => {
        const { data } = await client.query({
            query: GET_PRESIGNED_URL,
            variables: {
                input: {
                    path: `${Date.now()}-${file.name}`,
                    contentType: file.type,
                    method: SignedUrlMethod.PUT
                }
            }
        });

        const uploadUrl = data?.getPreSignedUrl?.url;
        console.log('Presigned URL:', uploadUrl);
        if (!uploadUrl) throw new Error('Presigned URL missing');

        const res = await fetch(uploadUrl, {
            method: SignedUrlMethod.PUT,
            headers: { 'Content-Type': file.type },
            body: file
        });

        if (!res.ok) throw new Error('Upload failed');

        return uploadUrl.split('?')[0]; // public image URL
    };

    return (
        <Editor
            apiKey={import.meta.env.VITE_APP_TINY_MCE}
            value={value}
            onEditorChange={(content) => setFieldValue(fieldName, content)}
            init={{
                height: 500,

                // 🔴 REQUIRED: show toolbar
                menubar: true,
                branding: false,

                // 🔴 REQUIRED: IMAGE PLUGIN
                plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'help',
                    'wordcount',
                    'image'
                ],

                // 🔴 REQUIRED: IMAGE BUTTON
                toolbar: `
  undo redo |
  styles formatselect fontfamily fontsize |
  bold italic underline strikethrough |
  alignleft aligncenter alignright alignjustify |
  bullist numlist |
  link image media table |
  code fullscreen preview help | 
`,
                // 🔴 REQUIRED: enable uploads
                automatic_uploads: true,
                fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                toolbar_mode: 'sliding',

                // 🔴 REQUIRED
                images_upload_handler: async (blobInfo) => {
                    const file = blobInfo.blob();
                    return await imageUploadHandler(file);
                },

                // 🔴 REQUIRED: image dialog options
                image_title: true,
                image_advtab: true,
                file_picker_types: 'image',

                // 👌 styling
                content_style: `
          body {
            font-family: ${theme.typography.fontFamily};
            font-size: 14px;
          }
        `
            }}
        />
    );
};

export default TinyMCEEditor;
