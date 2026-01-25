const initialState = {
    data: []
};

// eslint-disable-next-line
export const pageDragIndexReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DATA': {
            return {
                ...state,
                data: [...state.data, action.payload]
            };
        }
        case 'UPDATE_WHOLE_ARRAY': {
            return {
                data: action.payload
            };
        }
        case 'DELETE_DATA':
            return {
                ...state,
                data: state.data.filter((item: any) => item.uuid !== action.payload)
            };

        default:
            return state;
    }
};
