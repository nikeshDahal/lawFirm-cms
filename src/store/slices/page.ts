// third-party
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type PageType = {
    id: string;
    title: string;
    slug: string;
    pageType: string;
    content: string;
};

const defaultValue: PageType = {
    id: '',
    title: '',
    slug: '',
    pageType: '',
    content: ''
};
const slice = createSlice({
    name: 'page',
    initialState: defaultValue,
    reducers: {
        populatePage(state, action: PayloadAction<PageType>) {
            const { id, title, slug, pageType, content } = action.payload;
            state.id = id;
            state.title = title;
            state.slug = slug;
            state.pageType = pageType;
            state.content = content;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
export const { populatePage } = slice.actions;
