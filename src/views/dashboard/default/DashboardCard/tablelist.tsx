// import { alpha, Divider, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableRow, useTheme } from '@mui/material';
// import Box from '@mui/material/Box';
// import useTable from 'hooks/common/useTable';
// import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
// import { useState } from 'react';
// import { ArrangementOrder } from 'views/user-management/app-users/constants/types';
// import { headCellsForUserListOnDashboard } from 'views/user-management/app-users/constants/variables';
// import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
// import { useNavigate } from 'react-router-dom';
// import Noitems from 'components/no-items';
// import CustomLoader from 'components/loader';

// export default function List({ rows, loading }: any) {
//     const theme = useTheme();
//     const navigate = useNavigate();
//     const { TableContainer, EnhancedTableHead } = useTable();
//     const [order, setOrder] = useState<ArrangementOrder>('desc');
//     const [orderBy, setOrderBy] = useState<string>('createdAt');
//     const handleRequestSort = (event: React.SyntheticEvent<Element, Event> | null, property: string, type?: string) => {
//         setOrder(type === 'asc' ? 'asc' : 'desc');
//         setOrderBy(property);
//     };

//     const handleView = (userId: string) => {
//         navigate(`/app-user/profile/${userId}`);
//     };

//     console.log(rows);
//     return (
//         <Box sx={{ width: '100%' }}>
//             <Divider />
//             <TableContainer>
//                 <>
//                     <Table sx={{ '& .MuiTableCell-root': { padding: '5px' } }} aria-labelledby="tableTitle" size="small">
//                         <EnhancedTableHead
//                             headCells={headCellsForUserListOnDashboard}
//                             order={order}
//                             orderBy={orderBy}
//                             onRequestSort={handleRequestSort}
//                         />

//                         {!loading && (
//                             <TableBody>
//                                 {rows.length !== 0 && (
//                                     <>
//                                         {rows.map((row, index) => (
//                                             <TableRow key={index} hover sx={{ cursor: 'pointer' }}>
//                                                 <TableCell align="left" sx={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
//                                                     {row.firstName === null ? '-' : row.firstName + ' ' + row?.lastName}
//                                                 </TableCell>
//                                                 <TableCell align="left" sx={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
//                                                     {row?.subscriptionPackageName === null
//                                                         ? 'Unsubscribed'
//                                                         : row.subscriptionPackageName.includes('_')
//                                                           ? row.subscriptionPackageName.split('_')[1]
//                                                           : row.subscriptionPackageName}
//                                                 </TableCell>
//                                                 <TableCell align="left">
//                                                     <PopupState variant="popover" popupId="action-menu">
//                                                         {(popupState) => (
//                                                             <>
//                                                                 <IconButton
//                                                                     className="action-button"
//                                                                     size="small"
//                                                                     {...bindTrigger(popupState)}
//                                                                     sx={{
//                                                                         border: `1px solid ${theme.palette.primary.main}`,
//                                                                         color: theme.palette.primary.main,
//                                                                         width: '24px',
//                                                                         height: '24px',
//                                                                         // marginLeft: '-20px', // Move it left
//                                                                         '&:hover': {
//                                                                             borderColor: alpha(theme.palette.primary.main, 0.32),
//                                                                             bgcolor: alpha(theme.palette.primary.main, 0.12),
//                                                                             '.MuiSvgIcon-root': {
//                                                                                 color: 'background.paper'
//                                                                             }
//                                                                         }
//                                                                     }}
//                                                                 >
//                                                                     <MoreHorizOutlinedIcon fontSize="small" />
//                                                                 </IconButton>

//                                                                 <Menu
//                                                                     {...bindMenu(popupState)}
//                                                                     anchorOrigin={{
//                                                                         vertical: 'bottom',
//                                                                         horizontal: 'right'
//                                                                     }}
//                                                                     transformOrigin={{
//                                                                         vertical: 'top',
//                                                                         horizontal: 'right'
//                                                                     }}
//                                                                 >
//                                                                     <MenuItem
//                                                                         onClick={() => {
//                                                                             handleView(row?._id);
//                                                                         }}
//                                                                     >
//                                                                         View
//                                                                     </MenuItem>
//                                                                 </Menu>
//                                                             </>
//                                                         )}
//                                                     </PopupState>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </>
//                                 )}
//                             </TableBody>
//                         )}
//                     </Table>
//                     {rows.length === 0 && !loading && <Noitems />}
//                 </>
//             </TableContainer>
//             {loading ? <CustomLoader /> : null}
//         </Box>
//     );
// }
