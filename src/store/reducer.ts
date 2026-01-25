// third-party
import { combineReducers } from 'redux';

// project imports
import snackbarReducer from './slices/snackbar';
import tableReducer from './slices/table';
import userReducer from './slices/user';
import authReducer from './slices/auth';
import modalReducer from './slices/modal';
import settingReducer from './slices/settings';
import formReducer from './slices/form';
import editorReducer from './slices/editor';
import pageReducer from './slices/page';
import { pageDragIndexReducer } from 'hooks/reducers/usePageDragIndexReducer';
import adminNotification from './slices/adminNotification';
import category from './slices/category'


// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    user: userReducer,
    auth: authReducer,
    table: tableReducer,
    modal: modalReducer,
    settings: settingReducer,
    form: formReducer,
    editor: editorReducer,
    page: pageReducer,
    pageDragIndex: pageDragIndexReducer,
    adminNotification: adminNotification,
    category: category
});
export default reducer;
