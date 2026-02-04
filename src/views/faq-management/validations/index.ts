import * as Yup from 'yup';

export const faqValidationSchema = Yup.object().shape({
    items: Yup.array()
        .of(
            Yup.object().shape({
                question: Yup.string().required().trim().label('Question'),
                answer: Yup.string().required().trim().label('Answer'),
                status: Yup.string().required().trim().label('Status')
            })
        )
        .min(1, 'At least one FAQ item is required')
        .required('FAQ items are required')
});
