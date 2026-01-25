import { Box, Button, Menu, MenuItem, Pagination, PaginationItem, Stack } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useState } from 'react';

type CustomPaginationProps = {
    count: number;
    onPageChange: any;
    page: number;
    rowsPerPage: number;
    onItemClick: any;
    rowsPerPageOptions: any;
};

export default function CustomPagination({
    count,
    onPageChange,
    page,
    rowsPerPage,
    onItemClick,
    rowsPerPageOptions
}: CustomPaginationProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Stack className="custom-pagination">
            <Pagination
                count={Math.ceil(count / rowsPerPage)}
                color="primary"
                onChange={onPageChange}
                page={page + 1}
                renderItem={(item) => {
                    return <PaginationItem components={{ previous: KeyboardArrowLeftIcon, next: KeyboardArrowRightIcon }} {...item} />;
                }}
                hidePrevButton={page === 0}
            />
            <Box>
                <Button size="large" variant="outlined" endIcon={<ExpandMoreIcon />} onClick={handleClick} className="pagination-button">
                    {rowsPerPage} items
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                >
                    {rowsPerPageOptions.map((option, index) => (
                        <MenuItem
                            key={index}
                            value={option}
                            selected={option === rowsPerPage}
                            onClick={(event) => {
                                onItemClick(event);
                                handleClose();
                            }}
                        >
                            {option} items
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </Stack>
    );
}
