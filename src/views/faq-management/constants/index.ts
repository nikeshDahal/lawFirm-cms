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
        id: 'question',
        numeric: false,
        label: 'Question',
        align: 'left',
        sort: false
    },
    {
        id: 'answer',
        numeric: false,
        label: 'Answer',
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
        id: 'actions',
        numeric: false,
        label: 'Actions',
        align: 'right',
        sort: false
    }
];
