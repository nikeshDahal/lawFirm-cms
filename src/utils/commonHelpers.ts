export const truncateString = (str, num) => {
    if (str.length > num) {
        return `${str.slice(0, num)}...`;
    }
    return str;
};

export const firstLetterUppercase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
