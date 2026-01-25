import { AccordionContext } from 'contexts/AccordionContext';
import { useContext } from 'react';

export const useAccordion = () => {
    const context = useContext(AccordionContext);
    if (!context) throw new Error('context must be use inside provider');

    return context;
};
