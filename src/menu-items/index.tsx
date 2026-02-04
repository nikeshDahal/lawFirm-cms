import { NavItemType } from 'types';
import userManagement from './userManagement';
import dashboard from './dashboard';
import pageManagement from './pageManagement';
import template from './template';
import Feedback from './feedbackManagement';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
    items: [dashboard, userManagement, pageManagement, template]
};

export default menuItems;
