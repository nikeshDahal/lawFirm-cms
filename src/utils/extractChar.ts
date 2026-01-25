export const getInitials = (fullName: string | undefined | null, email: string | undefined | null): string => {
    if (fullName && fullName.trim() !== '') {
        const names = fullName.trim().split(' ');
        const firstInitial = names[0]?.charAt(0).toUpperCase() || '';
        const lastInitial = names.length > 1 ? names[names.length - 1]?.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    }

    if (email && email.includes('@')) {
        const localPart = email.split('@')[0];
        const parts = localPart.split(/[._]/); // split by dot or underscore
        const firstInitial = parts[0]?.charAt(0).toUpperCase() || '';
        const lastInitial = parts.length > 1 ? parts[1]?.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial || 'NA';
    }

    return 'NA'; // Default fallback
};
