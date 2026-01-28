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
        is: (val: PageTypeEnum) =>
            [
                PageTypeEnum.HOME,
                PageTypeEnum.RECOGNITION,
                PageTypeEnum.ABOUT,
                PageTypeEnum.FAQ,
                PageTypeEnum.CONTACT,
                PageTypeEnum.TERMS_AND_CONDITION,
                PageTypeEnum.PRIVACY_POLICY
            ].includes(val),
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
    }),

    /** ================= CONTACT US ================== */
    contactInfo: Yup.object().when('pageType', {
        is: (val: string) => val === PageTypeEnum.CONTACT,
        then: (schema) =>
            schema.shape({
                primaryEmail: Yup.string().email('Invalid email').required('Primary email is required'),
                secondaryEmail: Yup.string().email('Invalid email').required('Secondary email is required'),
                primaryPhone: Yup.string().required('Primary phone is required'),
                secondaryPhone: Yup.string().required('Secondary phone is required')
            }),
        otherwise: (schema) => schema.optional().nullable()
    }),

    location: Yup.object().when('pageType', {
        is: (val: string) => val === PageTypeEnum.CONTACT,
        then: (schema) =>
            schema.shape({
                label: Yup.string().required('Label is required'),
                address: Yup.string().required('Address is required'),
                city: Yup.string().required('City is required'),
                country: Yup.string().required('Country is required')
            }),
        otherwise: (schema) => schema.optional().nullable()
    }),

    officeHour: Yup.object().when('pageType', {
        is: (val: string) => val === PageTypeEnum.CONTACT,
        then: (schema) =>
            schema.shape({
                day: Yup.string().required('Day is required'),
                note: Yup.string().required('Note is required')
            }),
        otherwise: (schema) => schema.optional().nullable()
    }),

    socialMedia: Yup.object().when('pageType', {
        is: (val: string) => val === PageTypeEnum.CONTACT,
        then: (schema) =>
            schema.shape({
                facebook: Yup.string().required('Facebook link is required'),
                instagram: Yup.string().required('Instagram link is required'),
                linkedIn: Yup.string().required('LinkedIn link is required'),
                youtube: Yup.string().required('YouTube link is required'),
                tiktok: Yup.string().required('TikTok link is required'),
                twitter: Yup.string().required('Twitter link is required')
            }),
        otherwise: (schema) => schema.optional().nullable()
    })
});
