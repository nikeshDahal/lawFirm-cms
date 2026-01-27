import * as Yup from 'yup';
import { PageTypeEnum } from '../constants/page-management-enum';

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
    title: Yup.string().min(3).max(300).required().trim().label('Title'),
    subTitle: Yup.string().min(3).max(300).optional().nullable().trim().label('Sub title'),
    status: Yup.string().required().trim().label('Status'),
    slug: Yup.string().required().trim().label('Slug'),

    seoTags: Yup.object().shape({
        title: Yup.string().max(300).optional().trim().label('Seo title'),
        tags: Yup.string().max(300).optional().trim().label('Seo tags'),
        description: Yup.string().max(500).optional().trim().label('Seo description')
    }),

    content: Yup.string().when('pageType', {
        is: (val: PageTypeEnum) => [PageTypeEnum.HOME, PageTypeEnum.RECOGNITION, PageTypeEnum.ABOUT, PageTypeEnum.FAQ].includes(val),
        then: (schema) =>
            schema
                .test('content', 'Content description cannot be empty', (value) => validateContent(value))
                .required('Content description is required')
                .trim(),
        otherwise: (schema) => schema.optional().nullable().trim()
    }),

    /** ================= RECOGNITION ================== */
    recognitions: Yup.array().when('pageType', {
        is: (val: string) => val === PageTypeEnum.RECOGNITION,
        then: (schema) =>
            schema.of(
                Yup.object().shape({
                    title: Yup.string().required('Title is required'),
                    subtitle: Yup.string().required('Subtitle is required'),
                    description: Yup.string().required('Description is required')
                })
            ),
        otherwise: (schema) => schema.optional().nullable()
    }),

    /** ================= ABOUT US ================== */

    // yearsOfExperience lives at ROOT (not inside metaData)
    yearsOfExperience: Yup.number().when('pageType', {
        is: (val: string) => val === PageTypeEnum.ABOUT,
        then: (schema) => schema.required('Years of Experience is required').typeError('Years of Experience must be a number'),
        otherwise: (schema) => schema.optional().nullable()
    }),

    metaData: Yup.object().when('pageType', {
        is: (val: string) => val === PageTypeEnum.ABOUT,
        then: (schema) =>
            schema.shape({
                secondaryTitle: Yup.string().required('Secondary Title is required'),
                secondarySubTitle: Yup.string().required('Secondary Sub Title is required'),
                description: Yup.string().required('Description is required'),
                items: Yup.array()
                    .of(
                        Yup.object().shape({
                            title: Yup.string().required('Item Title is required'),
                            description: Yup.string().required('Item Description is required')
                        })
                    )
                    .min(2, 'At least two items are required')
            }),
        otherwise: (schema) => schema.optional().nullable()
    })
});
