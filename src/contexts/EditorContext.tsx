import useDraftReducer from 'hooks/reducers/useDraftReducer';
import { createContext } from 'react';
import { ActionsPayload, DraftEditorState } from 'types/editor/draftEditor';

type PropTypes = {
    children: JSX.Element;
};

type EditorContext = {
    state: DraftEditorState;
    dispatch: React.Dispatch<ActionsPayload>;
};

export const EditorContext = createContext<EditorContext | null>(null);

const EditorProvider = ({ children }: PropTypes) => {
    const { state, dispatch } = useDraftReducer();

    return <EditorContext.Provider value={{ state, dispatch }}>{children}</EditorContext.Provider>;
};

export default EditorProvider;
