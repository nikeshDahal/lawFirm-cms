export type HeadCell1 = {
    id: string;
    numeric: boolean;
    label: string;
    disablePadding?: string | boolean | undefined;
    align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
    sort: boolean;
};

export const headCells: HeadCell1[] = [
    {
        id: 'clientName',
        numeric: false,
        label: 'Client Name',
        align: 'left',
        sort: false
    },
    {
        id: 'clientDesignation',
        numeric: false,
        label: 'Client Designation',
        align: 'left',
        sort: false
    },
    {
        id: 'rating',
        numeric: false,
        label: 'Rating',
        align: 'left',
        sort: false
    },
    {
        id: 'message',
        numeric: false,
        label: 'Message',
        align: 'left',
        sort: false
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
        align: 'left',
        sort: false
    },
    {
        id: 'createdAt',
        numeric: false,
        label: 'Date',
        align: 'left',
        sort: false
    }
];

export const PageManagementListPath = '/page-management/list';
export const PageManagementEditPath = '/page-management/edit';
export const PageManagementAddPath = '/page-management/add';
