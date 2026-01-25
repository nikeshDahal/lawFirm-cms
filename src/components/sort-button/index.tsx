import { Button, Menu, MenuItem, MenuProps, alpha, styled } from '@mui/material';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function SortDropdown() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const sortMenuList = [
        {
            label: 'Any',
            handleSort: () => handleClose()
        },
        {
            label: 'Service - Alphabetical (A to Z)',
            handleSort: () => handleClose()
        },
        {
            label: 'Service - Alphabetical (Z to A)',
            handleSort: () => handleClose()
        },
        {
            label: 'Frequency - Ascending',
            handleSort: () => handleClose()
        },
        {
            label: 'Frequency - Descending',
            handleSort: () => handleClose()
        },
        {
            label: 'Commission - Ascending',
            handleSort: () => handleClose()
        },
        {
            label: 'Commission - Descending',
            handleSort: () => handleClose()
        },
        {
            label: 'Generated from Customers',
            handleSort: () => handleClose()
        },
        {
            label: 'Generated from Hairstylists',
            handleSort: () => handleClose()
        }
    ];

    return (
        <>
            <Button
                id="sort-customized-button"
                aria-controls={open ? 'sort-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="outlined"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ fontSize: '1rem', p: '2px 16px' }}
            >
                Sort
            </Button>
            <Menu
                id="sort-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'sort-button'
                }}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                open={open}
                onClose={handleClose}
            >
                {sortMenuList.map((sortOption, index) => (
                    <MenuItem key={index} onClick={sortOption.handleSort} disableRipple>
                        {sortOption.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

export default SortDropdown;
