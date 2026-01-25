import { createSlice } from "@reduxjs/toolkit";


export type Category = {
    _id: string;
    categoryName: string;
    categorySlug: string;
    color: string;
    textColor: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
}

type CategoryState = {
    data: Category[];
    lastFetched: number;
}

const initialState: CategoryState = {
    data: [],
    lastFetched: 0,
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.data = action.payload.categories;
            state.lastFetched = Date.now();
        }
    }
});

export const { setCategories } = categorySlice.actions;

export default categorySlice.reducer;