/* eslint no-nested-ternary: off */

import { Box, TableHead as MuiTableHead, TableRow, TableCell, TableSortLabel, TableContainer as MuiTableContainer } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { EnhancedTableHeadProps1 } from 'types';

type Children = {
    children: React.ReactElement;
};
const useTable = () => {
    const TableContainer = ({ children }: Children) => {
        return <MuiTableContainer>{children}</MuiTableContainer>;
    };

    const EnhancedTableHead = ({ headCells, order, orderBy, onRequestSort }: EnhancedTableHeadProps1) => {
        const createSortHandler = (property: string) => (event: React.SyntheticEvent<Element, Event>) => {
            onRequestSort(event, property);
        };

        return (
            <MuiTableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={headCell.sort ? (orderBy === headCell.id ? order : false) : false}
                        >
                            {headCell.sort ? (
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            ) : (
                                <span>{headCell.label}</span>
                            )}
                        </TableCell>
                    ))}
                    <TableCell sortDirection={false} />
                </TableRow>
            </MuiTableHead>
        );
    };

    return { TableContainer, EnhancedTableHead };
};

export default useTable;
