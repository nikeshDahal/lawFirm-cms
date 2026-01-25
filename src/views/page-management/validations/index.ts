import * as Yup from 'yup';

// Custom method to validate ReactQuill content
const validateContent = (value) => {
    // Quill uses <p><br></p> to represent an empty editor, so we check for this
    const isEmptyContent = !value || value === '<p><br></p>';
    if (isEmptyContent) {
      return false; // Fail validation
    }
    return true; // Pass validation
  };

export const pageValidationSchema = Yup.object().shape({
    pageType: Yup.string().required().trim().label('Page type'),
    title: Yup.string().min(3).max(30).required().trim().label('Title'),
    status: Yup.string().required().trim().label('Status'),
    slug: Yup.string().required().trim().label('Slug'),
    seoTags: Yup.object().shape({
        title: Yup.string().max(50).optional().trim().label('Seo title'),
        tags: Yup.string().max(300).optional().trim().label('Seo tags'),
        description: Yup.string().max(500).optional().trim().label('Seo description')
    }),
    content: Yup.string()
        .test('content', 'Content description cannot be empty', (value) => validateContent(value)) // Custom content validation
        .required()
        .trim()
        .label('Content description')
});