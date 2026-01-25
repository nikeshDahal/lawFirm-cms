import React, { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { adminAccountProfile, adminAdd, adminChangePassword, adminEdit, adminList, adminProfile, adminView } from 'constants/routePaths';

//solution to failed to fetch data dynamically
const lazyReactNaiveRetry: typeof React.lazy = (importer) => {
    const retryImport = async () => {
        try {
            return await importer();
        } catch (error) {
            // retry 5 times with 1 second delay
            for (let i = 0; i < 5; i++) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                try {
                    return await importer();
                } catch (e) {
                    console.log('retrying import');
                }
            }
            throw error;
        }
    };
    return React.lazy(retryImport);
};

// User managemenet routing
const AdminList = Loadable(lazyReactNaiveRetry(() => import('views/user-management/admins')));
const AdminAdd = Loadable(lazyReactNaiveRetry(() => import('views/user-management/admins/forms/AddAdmin')));
const AdminProfile = Loadable(lazyReactNaiveRetry(() => import('views/profile')));
const AdminProfileView = Loadable(lazyReactNaiveRetry(() => import('views/user-management/admins/view')));
const AdminAccountProfile = Loadable(lazyReactNaiveRetry(() => import('views/profile/UserProfile')));
const AdminChangePassword = Loadable(lazyReactNaiveRetry(() => import('views/profile/ChangePassword')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: adminList,
            element: <AdminList />
        },
        {
            path: adminAdd,
            element: <AdminAdd />
        },
        {
            path: adminProfile,
            element: <AdminProfile />
        },
        {
            path: adminEdit,
            element: <AdminProfileView />
        },
        {
            path: adminView,
            element: <AdminProfileView />
        },
        {
            path: adminAccountProfile,
            element: <AdminAccountProfile />
        },
        {
            path: adminChangePassword,
            element: <AdminChangePassword />
        }
    ]
};

export default MainRoutes;
