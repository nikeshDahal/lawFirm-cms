import { HeadCell } from './types';
import * as Yup from 'yup';

export const headCells: HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        label: 'Name',
        align: 'center',
        sort: false
    },
    {
        id: 'email',
        numeric: false,
        label: 'Email',
        align: 'center',
        sort: false
    },
    {
        id: 'submittedOn',
        numeric: false,
        label: 'Submitted on',
        align: 'center',
        sort: false
    },
    {
        id: 'message',
        numeric: false,
        label: 'Message',
        align: 'center',
        sort: false
    },
    {
        id: 'action',
        numeric: false,
        label: 'Action',
        align: 'right',
        sort: false
    }
];

// export const initialValues = {
//     categoryName: '',
//     categorySlug: '',
//     color: '#dacafbe0',
//     icon: ''
// };
