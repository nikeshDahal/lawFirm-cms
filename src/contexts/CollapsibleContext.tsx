import { createContext, useState } from 'react';

type ContextType = {
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    handleExpandClick: () => void;
};

export const CollapsibleContext = createContext<ContextType | null>(null);

type PropTypes = {
    children: any;
};

const CollapsibleProvider = ({ children }: PropTypes) => {
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return <CollapsibleContext.Provider value={{ expanded, setExpanded, handleExpandClick }}>{children}</CollapsibleContext.Provider>;
};

export default CollapsibleProvider;
