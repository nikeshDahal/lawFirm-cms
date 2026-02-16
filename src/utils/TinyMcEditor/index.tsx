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
                height: 600,
                menubar: true,
                branding: false,

                /*
    ===============================
    PLUGINS
    ===============================
    */
                plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
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
                    'paste',
                    'autoresize',
                    'quickbars'
                ],

                /*
    ===============================
    TOOLBAR
    ===============================
    */
                toolbar: `
      undo redo |
      styles formatselect fontfamily fontsize |
      bold italic underline strikethrough |
      alignleft aligncenter alignright alignjustify |
      bullist numlist outdent indent |
      link image media table |
      removeformat |
      code fullscreen preview help
    `,

                toolbar_mode: 'sliding',

                /*
    ===============================
    STYLE FORMATS (Legal CMS)
    ===============================
    */
                style_formats: [
                    { title: 'Paragraph', block: 'p' },
                    { title: 'Heading 1', block: 'h1' },
                    { title: 'Heading 2', block: 'h2' },
                    { title: 'Heading 3', block: 'h3' },
                    { title: 'Heading 4', block: 'h4' },
                    { title: 'Blockquote', block: 'blockquote' },
                    { title: 'Code Block', block: 'pre' }
                ],

                fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 30pt 36pt 48pt',

                /*
===============================
LIST BEHAVIOR FIX ⭐⭐⭐⭐
===============================
*/

                lists_indent_on_tab: true,
                indent_use_margin: true,
                indentation: '2em',

                advlist_bullet_styles: 'default,circle,disc,square',
                advlist_number_styles: 'default,lower-alpha,lower-roman,upper-alpha,upper-roman',

                /*
    ===============================
    IMAGE UPLOAD
    ===============================
    */
                automatic_uploads: true,
                images_upload_handler: async (blobInfo) => {
                    const file = blobInfo.blob();
                    return await imageUploadHandler(file);
                },
                image_title: true,
                image_advtab: true,
                file_picker_types: 'image',

                /*
    ===============================
    TABLE CONFIG
    ===============================
    */
                table_default_attributes: {
                    border: '1'
                },
                table_default_styles: {
                    borderCollapse: 'collapse',
                    width: '100%'
                },

                /*
    ===============================
    CLEAN PASTE CONFIG ⭐⭐⭐⭐
    ===============================
    */
                paste_as_text: false,
                paste_data_images: true,
                paste_webkit_styles: 'none',
                paste_remove_styles_if_webkit: true,
                paste_merge_formats: true,
                paste_convert_word_fake_lists: true,

                paste_preprocess: (plugin, args) => {
                    args.content = args.content
                        .replace(/class="Mso[a-zA-Z0-9]+"/g, '')
                        .replace(/<span[^>]*>\s*<\/span>/g, '')
                        .replace(/style="[^"]*"/g, '')
                        .replace(/<!--.*?-->/g, '')
                        .replace(/<\/?o:[^>]*>/g, '');
                },

                /*
    ===============================
    VALID HTML STRUCTURE ⭐⭐⭐⭐
    ===============================
    */
                valid_elements:
                    'p,br,strong/b,em/i,u,strike,blockquote,' +
                    'h1,h2,h3,h4,h5,h6,' +
                    'ul,ol,li,' +
                    'table,thead,tbody,tr,td,th,' +
                    'a[href|target],img[src|alt|width|height],' +
                    'span[style],div[align],hr',

                extended_valid_elements: 'div[align],p[align],span[style]',

                /*
    ===============================
    CLEAN OUTPUT
    ===============================
    */
                cleanup: true,
                verify_html: true,
                convert_fonts_to_spans: true,
                forced_root_block: 'p',

                /*
    ===============================
    QUICK TOOLBAR
    ===============================
    */
                quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
                quickbars_insert_toolbar: 'image table',

                /*
    ===============================
    AUTOSAVE (optional)
    ===============================
    */
                autosave_ask_before_unload: true,
                autosave_interval: '30s',

                /*
    ===============================
    EDITOR CONTENT LOOK
    (visual only)
    ===============================
    */
                content_style: `
      body {
        font-family: ${theme.typography.fontFamily};
        font-size: 15px;
        line-height: 1.7;
        padding: 20px;
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }

      td, th {
        border: 1px solid #ddd;
        padding: 8px;
      }

      blockquote {
        border-left: 4px solid #C5A059;
        padding-left: 12px;
        color: #555;
      }
    `
            }}
        />
    );
};

export default TinyMCEEditor;
