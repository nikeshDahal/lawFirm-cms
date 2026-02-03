import * as Yup from 'yup';

export const teamValidationSchema = Yup.object().shape({
    name: Yup.string().min(2).max(100).required().trim().label('Name'),
    designation: Yup.string().min(2).max(100).required().trim().label('Designation'),
    practiceArea: Yup.string().min(2).max(100).required().trim().label('Practice Area'),
    status: Yup.string().required().trim().label('Status'),
    profileImage: Yup.string().optional().trim().label('Profile Image'),
    facebook: Yup.string().url('Invalid Facebook URL').optional(),
    email: Yup.string().email('Invalid email').required().label('Email'),
    linkedIn: Yup.string().url('Invalid LinkedIn URL').optional(),
    twitter: Yup.string().url('Invalid Twitter URL').optional()
});
