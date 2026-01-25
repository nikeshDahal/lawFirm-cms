export const getUserRole = () => {
    const userDetails = localStorage.getItem('persist:auth');
    if (!userDetails) {
        console.log('No user details found in localStorage.');
        return null;
    }

    try {
        const parsedDetails = JSON.parse(userDetails);
        const user = JSON.parse(parsedDetails.user);
        return user.role;
    } catch (error) {
        console.error('Error parsing user details:', error);
        return null;
    }
};
