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
        id: 'name',
        numeric: false,
        label: 'Name',
        align: 'left',
        sort: false
    },
    {
        id: 'designation',
        numeric: false,
        label: 'Designation',
        align: 'left',
        sort: false
    },
    {
        id: 'practiceArea',
        numeric: false,
        label: 'Practice Area',
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
    },
    {
        id: 'actions',
        numeric: false,
        label: 'Actions',
        align: 'right',
        sort: false
    }
];
