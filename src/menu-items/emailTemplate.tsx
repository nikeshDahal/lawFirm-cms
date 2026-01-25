// third-party
import { FormattedMessage } from 'react-intl';

// assets
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
// type
import { NavItemType } from 'types';
import { SettingIcon } from 'components/icons';

const icons = {
    SettingIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const emailTemplate: NavItemType = {
    id: 'emailTemplate',
    title: <FormattedMessage id="emailTemplate" />,
    icon: icons.SettingIcon,
    type: 'group',
    children: [
        {
            id: 'email-template',
            title: 'Email templates',
            type: 'item',
            icon: EmailOutlinedIcon,
            url: '/email-template/list',
            breadcrumbs: false
        }
    ]
};

export default emailTemplate;
