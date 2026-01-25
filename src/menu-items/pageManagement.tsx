// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard } from '@tabler/icons-react';
import { PageIcon } from 'components/icons';

// type
import { NavItemType } from 'types';
import { getUserRole } from 'utils/userDetail';

const icons = {
    IconDashboard: IconDashboard
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
// const userRole = getUserRole();
const pageManagement: NavItemType = {
    id: 'Page Management',
    title: <FormattedMessage id="Page Management" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'page-management',
            title: 'Page management',
            type: 'item',
            icon: PageIcon,
            url: '/page-management/list',
            breadcrumbs: false,
            roles: ['SUPERADMIN', 'ADMIN']
        },
        {
            id: 'publication',
            title: 'Publications',
            type: 'item',
            icon: PageIcon,
            url: '/publication/list',
            breadcrumbs: false,
            roles: ['SUPERADMIN', 'ADMIN']
        },
        {
            id: 'practice-area',
            title: 'Practice Areas',
            type: 'item',
            icon: PageIcon,
            url: '/practice-area/list',
            breadcrumbs: false,
            roles: ['SUPERADMIN', 'ADMIN']
        },
        {
            id: 'testimonial',
            title: 'Testimonials',
            type: 'item',
            icon: PageIcon,
            url: '/testimonial/list',
            breadcrumbs: false,
            roles: ['SUPERADMIN', 'ADMIN']
        },
        {
            id: 'faq',
            title: 'FAQs',
            type: 'item',
            icon: PageIcon,
            url: '/faq/list',
            breadcrumbs: false,
            roles: ['SUPERADMIN', 'ADMIN']
        },
        {
            id: 'team',
            title: 'Team',
            type: 'item',
            icon: PageIcon,
            url: '/team/list',
            breadcrumbs: false,
            roles: ['SUPERADMIN', 'ADMIN']
        }
    ]
};

export default pageManagement;
