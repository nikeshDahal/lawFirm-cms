import { EditorState } from 'draft-js';

export type DraftEditorState = {
    HTMLButton: boolean;
    editorState: EditorState;
    rawHTML: string;
};

export type ActionsPayload = {
    type: string;
    text?: string;
    editorState?: EditorState;
};

export enum Actions {
    TOGGLE = 'TOGGLE',
    RESET_EDITOR = 'RESET_EDITOR',
    SET_EDITOR_STATE = 'SET_EDITOR_STATE',
    SET_RAW_HTML = 'SET_RAW_HTML',
    CONVERT_TO_EDITOR_STATE = 'CONVERT_TO_EDITOR_STATE',
    CONVERT_TO_RAW_HTML = 'CONVERT_TO_RAW_HTML'
}
