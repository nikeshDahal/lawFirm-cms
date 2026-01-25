import { createContext, useState } from 'react';

type ContextType = {
    expanded: string | false;
    handleChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
};

export const AccordionContext = createContext<ContextType | null>(null);

type PropTypes = {
    children: any;
};

const AccordionProvider = ({ children }: PropTypes) => {
    const [expanded, setExpanded] = useState<string | false>(false);
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    return <AccordionContext.Provider value={{ expanded, handleChange }}>{children}</AccordionContext.Provider>;
};

export default AccordionProvider;
