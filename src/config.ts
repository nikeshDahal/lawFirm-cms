// types
import { ConfigProps, MenuOrientation, ThemeDirection, ThemeMode } from 'types/config';

export const DASHBOARD_PATH = '/';
export const HORIZONTAL_MAX_ITEM = 7;

export const FIREBASE_API = {
    apiKey: 'AIzaSyBernKzdSojh_vWXBHt0aRhf5SC9VLChbM',
    authDomain: 'berry-material-react.firebaseapp.com',
    projectId: 'Mycomms',
    storageBucket: 'berry-material-react.appspot.com',
    messagingSenderId: '901111229354',
    appId: '1:901111229354:web:a5ae5aa95486297d69d9d3',
    measurementId: 'G-MGJHSL8XW3'
};

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
// like '/berry-material-react/react/default'
export const BASE_PATH = '';

const config: ConfigProps = {
    menuOrientation: MenuOrientation.VERTICAL,
    miniDrawer: false,
    fontFamily: `'Poppins', sans-serif`,
    borderRadius: 8,
    outlinedFilled: true,
    mode: ThemeMode.LIGHT,
    presetColor: 'default',
    i18n: 'en',
    themeDirection: ThemeDirection.LTR,
    container: false
};

export default config;
