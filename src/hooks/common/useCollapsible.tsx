import { CollapsibleContext } from 'contexts/CollapsibleContext';
import { useContext } from 'react';

export const useCollapsible = () => {
    const context = useContext(CollapsibleContext);
    if (!context) throw new Error('context must be use inside provider');

    return context;
};
