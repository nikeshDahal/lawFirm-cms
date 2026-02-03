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

export const testimonialValidationSchema = Yup.object().shape({
    rating: Yup.number().min(1).max(5).required().label('Rating'),
    clientName: Yup.string().min(3).max(100).required().trim().label('Client name'),
    clientDesignation: Yup.string().min(3).max(100).required().trim().label('Client designation'),
    status: Yup.string().required().trim().label('Status'),
    clientImage: Yup.string().required().trim().label('Client image'),
    message: Yup.string()
        .test('content', 'Message cannot be empty', (value) => validateContent(value)) // Custom content validation
        .required()
        .trim()
        .label('Message')
});
