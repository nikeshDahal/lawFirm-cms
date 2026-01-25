import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../store/slices/category";
import { useGQL } from "views/preset-template/hooks/useGQL";
import { RootState } from "store";

export const useCategories = () => {
    const dispatch = useDispatch();
    const { data: categories, lastFetched } = useSelector((state: RootState) => state.category);
    const { GET_ALL_CATEGORY } = useGQL();
    const { data, loading, error } = GET_ALL_CATEGORY();
    useEffect(() => {
        if (!loading && data?.getAllCategories?.category) {
            dispatch(setCategories({ categories: data.getAllCategories.category }));
        }
    }, [data, loading, dispatch]);

    return {
        categories: categories || [],
        loading: loading ? loading : false,
        lastFetched
    };
};