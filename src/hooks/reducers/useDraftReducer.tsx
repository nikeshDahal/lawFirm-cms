import { useReducer } from 'react';
import invariant from 'tiny-invariant';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHTML from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { DraftEditorState, ActionsPayload, Actions } from 'types/editor/draftEditor';

const reducer = (state: DraftEditorState, actions: ActionsPayload) => {
    switch (actions.type) {
        case Actions.TOGGLE:
            state.HTMLButton = !state.HTMLButton;
            return { ...state };

        case Actions.SET_EDITOR_STATE:
            invariant(actions.editorState, 'Not empty on set-editor-state');
            state.editorState = actions.editorState;
            return { ...state };

        case Actions.SET_RAW_HTML:
            invariant(actions.text, 'Not empty on set-raw-html');
            state.rawHTML = actions.text;
            return { ...state };

        case Actions.RESET_EDITOR:
            state.HTMLButton = false;
            state.editorState = EditorState.createEmpty();
            state.rawHTML = '';
            return { ...state };

        case Actions.CONVERT_TO_EDITOR_STATE: {
            invariant(actions.text, 'Not empty whilst converting to editor state');
            const blocksFromHtml = htmlToDraft(actions.text);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);
            state.editorState = editorState;
            return { ...state };
        }

        case Actions.CONVERT_TO_RAW_HTML: {
            const rawHTML = draftToHTML(convertToRaw(state.editorState.getCurrentContent()));
            state.rawHTML = rawHTML;
            return { ...state };
        }

        default:
            return state;
    }
};

const useDraftReducer = () => {
    const [state, dispatch] = useReducer(reducer, { HTMLButton: false, editorState: EditorState.createEmpty(), rawHTML: ' ' });
    return { state, dispatch };
};

export default useDraftReducer;
