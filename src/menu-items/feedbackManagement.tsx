// third-party
import { FormattedMessage } from 'react-intl';

import { NavItemType } from 'types';
import { FeedBackIcon } from 'components/icons';

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const Feedback: NavItemType = {
    id: 'feedback',
    title: <FormattedMessage id="feedback" />,
    icon: FeedBackIcon,
    type: 'group',
    children: [
        {
            id: 'feedback',
            title: 'Feedback',
            type: 'item',
            url: '/feedback/list',
            icon: FeedBackIcon,
            breadcrumbs: false,
            roles: ['SUPERADMIN', 'ADMIN']
        }
    ]
};

export default Feedback;
