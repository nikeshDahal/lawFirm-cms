enum Types {
    HEADER = 'header',
    BANNER = 'banner',
    HOME_BANNER = 'homeBanner',
    IMAGE_COLUMN = 'imageColumn',
    FEATURED_PRODUCT = 'featuredProduct',
    STEPS = 'steps'
}

export const flatten = (values) => {
    return values.map((value) => {
        const [id, ...others] = Object.values(value);
        const inputFlatten = others.reduce((acc: Array<any>, current) => acc.concat(current), []);
        const readyInputs = inputFlatten.reduce((acc, current) => ({ ...acc, ...current }));
        return { id, ...readyInputs };
    });
};

export const genResults = ({ main, sub }) => {
    if (main.length > 0) {
        const idExists = Object.keys(main[0]).some((key) => key === 'id');
        if (idExists) {
            const [id, ...mainArr] = Object.values(main[0]);
            const [outer] = mainArr.reduce((acc: Array<any>, current) => acc.concat(current), []);
            const inner = flatten(sub);
            return { main: { id, ...outer }, sub: inner };
        }

        const [...mainArr] = Object.values(main[0]);
        const [outer] = mainArr.reduce((acc: Array<any>, current) => acc.concat(current), []);
        const inner = flatten(sub);

        return { main: { ...outer }, sub: inner };
    }

    const [inner] = flatten(sub);
    return { ...inner };
};

export const groupBy = (key) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj.data);
        return objectsByKeyValue;
    }, {});

export const imageUploads = (data) =>
    data.map(async (value) => {
        switch (value.key) {
            case Types.HEADER:
                return value;

            case Types.BANNER:
                return {
                    ...value,
                    data: { ...value.data, image: value.data.image.name }
                };

            case Types.HOME_BANNER:
                return {
                    ...value,
                    data: { ...value.data, image: value.data.image.name }
                };

            case Types.FEATURED_PRODUCT: {
                const updatedMeta = await Promise.all(
                    value.data.meta.map(async (field) => ({
                        ...field,
                        image: field.image.name
                    }))
                ).then((resolved) => resolved);

                return { ...value, data: { ...value.data, meta: await updatedMeta } };
            }

            case Types.IMAGE_COLUMN: {
                const updatedMeta = await Promise.all(
                    value.data.meta.map(async (field) => ({
                        ...field,
                        image: field.image.name
                    }))
                ).then((resolved) => resolved);

                return { ...value, data: { ...value.data, meta: await updatedMeta } };
            }

            case Types.STEPS: {
                const updatedMeta = await Promise.all(
                    value.data.meta.map(async (field) => ({
                        ...field,
                        image: field.image.name
                    }))
                ).then((resolved) => resolved);

                return { ...value, data: { ...value.data, meta: await updatedMeta } };
            }

            default:
                return value;
        }
    });
