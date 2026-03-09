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
        //     <Editor
        //         apiKey={import.meta.env.VITE_APP_TINY_MCE}
        //         value={value}
        //         onEditorChange={(content) => setFieldValue(fieldName, content)}
        //         init={{
        //             height: 500,
        //             menubar: true,
        //             branding: false,

        //             plugins: [
        //                 'advlist',
        //                 'autolink',
        //                 'lists',
        //                 'link',
        //                 'charmap',
        //                 'preview',
        //                 'anchor',
        //                 'searchreplace',
        //                 'visualblocks',
        //                 'code',
        //                 'fullscreen',
        //                 'insertdatetime',
        //                 'media',
        //                 'table',
        //                 'help',
        //                 'wordcount',
        //                 'image',
        //                 'paste'
        //             ],

        //             toolbar: `
        //   undo redo |
        //   styles formatselect fontfamily fontsize |
        //   bold italic underline strikethrough |
        //   alignleft aligncenter alignright alignjustify |
        //   bullist numlist |
        //   link image media table |
        //   code fullscreen preview help
        // `,

        //             toolbar_mode: 'sliding',

        //             automatic_uploads: true,
        //             fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',

        //             images_upload_handler: async (blobInfo) => {
        //                 const file = blobInfo.blob();
        //                 return await imageUploadHandler(file);
        //             },

        //             image_title: true,
        //             image_advtab: true,
        //             file_picker_types: 'image',

        //             /*
        // ⭐⭐⭐⭐ MOST IMPORTANT PART ⭐⭐⭐⭐
        // CLEAN PASTE FROM GOOGLE DOCS / WORD
        // */
        //             paste_as_text: false,
        //             paste_data_images: true,
        //             paste_webkit_styles: 'none',
        //             paste_remove_styles_if_webkit: true,
        //             paste_merge_formats: true,

        //             paste_preprocess: (plugin, args) => {
        //                 args.content = args.content

        //                     // Remove Word classes
        //                     .replace(/class="Mso[a-zA-Z0-9]+"/g, '')

        //                     // Remove empty spans
        //                     .replace(/<span[^>]*>\s*<\/span>/g, '')

        //                     // Remove style attributes except alignment
        //                     .replace(/style="[^"]*"/g, '')

        //                     // Remove XML tags
        //                     .replace(/<\/?o:[^>]*>/g, '')

        //                     // Remove comments
        //                     .replace(/<!--.*?-->/g, '');
        //             },

        //             /*
        // Clean HTML structure before saving
        // */
        //             valid_elements:
        //                 'p,br,strong/b,em/i,u,strike,blockquote,' +
        //                 'h1,h2,h3,h4,h5,h6,' +
        //                 'ul,ol,li,' +
        //                 'table,thead,tbody,tr,td,th,' +
        //                 'a[href|target],img[src|alt|width|height],' +
        //                 'span[style],div[align],hr',

        //             extended_valid_elements: 'div[align],p[align],span[style]',

        //             /*
        // Prevent weird nesting
        // */
        //             forced_root_block: 'p',

        //             /*
        // Fix lists pasted from docs
        // */
        //             paste_convert_word_fake_lists: true,

        //             /*
        // Prevent inline font tags
        // */
        //             convert_fonts_to_spans: true,

        //             /*
        // Keep clean HTML
        // */
        //             cleanup: true,
        //             verify_html: true,

        //             /*
        // Editor look only (not saved)
        // */
        //             content_style: `
        //   body {
        //     font-family: ${theme.typography.fontFamily};
        //     font-size: 14px;
        //     line-height: 1.6;
        //   }

        //   table {
        //     border-collapse: collapse;
        //     width: 100%;
        //   }

        //   td, th {
        //     border: 1px solid #ddd;
        //     padding: 8px;
        //   }
        // `
        //         }}
        //     />
        <Editor
            apiKey={import.meta.env.VITE_APP_TINY_MCE}
            value={value}
            onEditorChange={(content) => setFieldValue(fieldName, content)}
            init={{
                height: 500,
                plugins: [
                    'advlist',
                    'autolink',
                    'autosave',
                    'directionality', // optional — can remove if not needed anymore
                    'fullscreen',
                    'help',
                    'image',
                    'importcss',
                    'insertdatetime',
                    'link',
                    'lists',
                    'nonbreaking',
                    'quickbars',
                    'searchreplace',
                    'table',
                    'visualblocks',
                    'visualchars',
                    'wordcount'
                ],
                toolbar:
                    'undo redo | \
      blocks fontfamily fontsize | \
      bold italic underline strikethrough | \
      align numlist bullist | \
      link image | table | \
      lineheight outdent indent | \
      forecolor backcolor removeformat | \
      fullscreen',
                images_upload_handler: async (blobInfo) => {
                    const file = blobInfo.blob();
                    return await imageUploadHandler(file);
                },

                image_title: true,
                image_advtab: true,
                file_picker_types: 'image',
                menubar: 'file edit view insert format tools table help'
            }}
        />
    );
};

export default TinyMCEEditor;
