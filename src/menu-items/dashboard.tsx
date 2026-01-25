// third-party
import { FormattedMessage } from 'react-intl';

// type
import { NavItemType } from 'types';

//icons
import { HomeIcon } from 'components/icons';
import { getUserRole } from 'utils/userDetail';

const icons = {
    IconDashboard: HomeIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
// const userRole = getUserRole();
const dashboard: NavItemType = {
    id: 'dashboard',
    title: <FormattedMessage id="dashboard" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: <FormattedMessage id="dashboard" />,
            type: 'item',
            url: '/dashboard',
            icon: icons.IconDashboard,
            breadcrumbs: false,
            roles: ['SUPERADMIN', 'ADMIN']
        }
    ]
};

export default dashboard;
