import { useEffect, useMemo } from 'react';
import _debounce from 'lodash.debounce';

type fn = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => void;

const useDebouncedSearch = (handleSearch: fn) => {
    const debouncedSearch = useMemo(() => {
        return _debounce(handleSearch, 300);
    }, []);

    useEffect(() => {
        debouncedSearch.cancel();
    });

    return [debouncedSearch];
};

export default useDebouncedSearch;
