import React from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import FeedbackList from 'views/Feedbackmanagement';
import FeedbackView from 'views/Feedbackmanagement/forms/viewFeedback';

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

// ==============================|| MAIN ROUTING ||============================== //

const FeedbackRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: 'feedback/list',
            element: <FeedbackList />
        },
        {
            path: 'feedback/view/:id',
            element: <FeedbackView />
        }
    ]
};

export default FeedbackRoutes;
