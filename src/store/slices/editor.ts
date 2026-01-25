// third-party
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHTML from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

// ----------------------------------------------------------------------
interface IDefaultState {
    HTMLButton: boolean;
    editorState: EditorState;
    rawHTML: string;
}

const initialState: IDefaultState = {
    HTMLButton: false,
    editorState: EditorState.createEmpty(),
    rawHTML: ''
};
const slice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        toggleHTMLButton: (state) => {
            state.HTMLButton = !state.HTMLButton;
        },
        setEditorState: (state, action: PayloadAction<EditorState>) => {
            // console.log(action);
            state.editorState = action.payload;
        },
        setRawHTML: (state, action: PayloadAction<string>) => {
            state.rawHTML = action.payload;
        },

        resetEditor: (state) => {
            state.HTMLButton = false;
            state.editorState = EditorState.createEmpty();
            state.rawHTML = '';
        },
        convertToHTML: (state, action: PayloadAction<EditorState>) => {
            const rawHTML = draftToHTML(convertToRaw(state.editorState.getCurrentContent()));
            state.rawHTML = rawHTML;
        },
        convertToEditorState: (state, action: PayloadAction<string>) => {
            const blocksFromHtml = htmlToDraft(action.payload);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);
            state.editorState = editorState;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
export const { toggleHTMLButton, setEditorState, convertToEditorState, convertToHTML, setRawHTML, resetEditor } = slice.actions;
