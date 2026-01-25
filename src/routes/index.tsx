import { createBrowserRouter } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import DashboardRoutes from './DashboardRoutes';
import PageManagementRoutes from './PageManagementRoutes';
import TemplateRoutes from './TemplateRoutes';
import FeedbackRoutes from './feedbackRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([LoginRoutes, MainRoutes, DashboardRoutes, PageManagementRoutes, TemplateRoutes, FeedbackRoutes], {
    basename: import.meta.env.VITE_APP_BASE_NAME
});
export default router;
