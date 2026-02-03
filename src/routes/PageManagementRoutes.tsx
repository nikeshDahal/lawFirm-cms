import React from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AddEditPagePracticeArea from 'views/practice-area-management/form/AddEditPage';
import Publication from 'views/publication-management';
import AddEditPublicationPage from 'views/publication-management/form/AddEditPage';

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

const PageManagementListPath = '/page-management/list';
const PageManagementAddPath = '/page-management/add';
const PageManagementEditPath = '/page-management/edit';
export const PracticeAreaPath = '/practice-area';
export const PublicationPath = '/publication';

/* Page management */
const PageManagementList = Loadable(lazyReactNaiveRetry(() => import('views/page-management')));
const PageManagementAddEdit = Loadable(lazyReactNaiveRetry(() => import('views/page-management/form/AddEditPage')));
const PracticeArea = Loadable(lazyReactNaiveRetry(() => import('views/practice-area-management')));
// const PageManagementEdit = Loadable(lazyReactNaiveRetry(() => import('views/page-management/form/EditPage')));

// ==============================|| MAIN ROUTING ||============================== //

const PageManagementNewRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: PageManagementListPath,
            element: <PageManagementList />
        },
        {
            path: PageManagementAddPath,
            element: <PageManagementAddEdit />
        },
        {
            path: `${PageManagementEditPath}/:id`,
            element: <PageManagementAddEdit />
        },
        {
            path: `${PracticeAreaPath}/list`,
            element: <PracticeArea />
        },
        {
            path: `${PracticeAreaPath}/add`,
            element: <AddEditPagePracticeArea />
        },
        {
            path: `${PracticeAreaPath}/edit/:id`,
            element: <AddEditPagePracticeArea />
        },
        {
            path: `${PublicationPath}/list`,
            element: <Publication />
        },
        {
            path: `${PublicationPath}/add`,
            element: <AddEditPublicationPage />
        },
        {
            path: `${PublicationPath}/edit/:id`,
            element: <AddEditPublicationPage />
        }
    ]
};

export default PageManagementNewRoutes;
