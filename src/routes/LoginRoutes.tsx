import { lazy } from 'react';

// project imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';
import {
    appUserResetPasswordPath,
    authOtpVerification,
    checkMail,
    codeVerification,
    errorPage,
    forgot,
    home,
    login,
    resetPassword
} from 'constants/routePaths';

// login routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication4/Login')));
const AuthCheckMail = Loadable(lazy(() => import('views/pages/authentication/authentication4/CheckMail')));

/* Use following code if register page is required */
// const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication4/Register')));

const AuthForgotPassword = Loadable(lazy(() => import('views/pages/authentication/authentication4/ForgotPassword')));
const ErrorPage = Loadable(lazy(() => import('views/pages/maintenance/Error')));
const AuthResetPassword = Loadable(lazy(() => import('views/pages/authentication/authentication4/ResetPassword')));
const AppUserResetPassword = Loadable(lazy(() => import('views/pages/authentication/authentication4/ResetPassword')));
const AuthCodeVerification = Loadable(lazy(() => import('views/pages/authentication/authentication4/CodeVerification')));
const AuthOtpVerification = Loadable(lazy(() => import('views/pages/authentication/authentication4/AuthOtpVerification')));

// ==============================|| AUTH ROUTING ||============================== //
/*  */
const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: home,
            element: <AuthLogin />
        },
        {
            path: login,
            element: <AuthLogin />
        },
        /* Use following code if register page is required */
        // {
        //     path: '/register',
        //     element: <AuthRegister />
        // },
        {
            path: forgot,
            element: <AuthForgotPassword />
        },
        {
            path: resetPassword,
            element: <AuthResetPassword />
        },
        {
            path: appUserResetPasswordPath,
            element: <AppUserResetPassword />
        },
        {
            path: checkMail,
            element: <AuthCheckMail />
        },
        {
            path: codeVerification,
            element: <AuthCodeVerification />
        },
        {
            path: authOtpVerification,
            element: <AuthOtpVerification />
        },
        {
            path: errorPage,
            element: <ErrorPage />
        }
    ]
};

export default LoginRoutes;
