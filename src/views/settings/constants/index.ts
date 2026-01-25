export const defaultValue = [
    {
        _id: '',
        title: '',
        value: '',
        fieldType: '',
        values: [''],
        options: [{label:'', value:''}],
        updatedAt: new Date(),
        createdAt: new Date(),
        slug: '',
        discription: '',
        order: 1
    }
];

export const defaultImageConfig = {
    imagePlaceholder: import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '',
    imageSet: false
};

export const s3bucketPath = 'temp/';