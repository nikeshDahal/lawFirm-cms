// third-party
import { FormattedMessage } from 'react-intl';

// assets
// import { IconKey, IconBug } from '@tabler/icons-react';
// import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { TemplateIcon } from 'components/icons';

// type
import { NavItemType } from 'types';

// constant
const icons = { TemplateIcon };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const template: NavItemType = {
    id: 'pages',
    title: <FormattedMessage id="template" />,
    icon: icons.TemplateIcon,
    type: 'group',
    children: [
        {
            id: 'template',
            title: <FormattedMessage id="templates" />,
            type: 'collapse',
            icon: icons.TemplateIcon,
            children: [
                // {
                //     id: 'preset-template',
                //     title: 'Task templates',
                //     type: 'item',
                //     url: '/preset-template/list',
                //     breadcrumbs: false,
                //     roles: ['SUPERADMIN', 'ADMIN', 'EDITOR']
                // },
                {
                    id: 'email-template',
                    title: 'Email templates',
                    type: 'item',
                    url: '/email-template/list',
                    breadcrumbs: false,
                    roles: ['SUPERADMIN', 'ADMIN', 'EDITOR']
                }
            ]
        }
    ]
};

export default template;
