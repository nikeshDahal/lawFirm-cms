// import React from 'react';
// import Header from './header';
// import MainCard from 'ui-component/cards/MainCard';
// import List from './tablelist';
// import ListCardSkeleton from 'views/dashboard/skeleton/listCard';
// import Noitems from 'components/no-items';

// type DashboardCardProps = {
//     title: string;
//     sort?: boolean;
//     total?: number | undefined;
//     rows?: Array<any>;
//     columns?: Array<any>;
//     more?: number | undefined;
//     linkTo?: string;
//     loading: boolean;
// };

// function DashboardCard({ title, sort, total, rows, columns, more, linkTo, loading }: DashboardCardProps) {
//     return (
//         <MainCard sx={{ '.MuiCardContent-root': { padding: '24px 16px' } }}>
//             {loading ? (
//                 <ListCardSkeleton />
//             ) : (
//                 <>
//                     <Header title={title} linkTo={linkTo} total={total} />

//                     {!loading && total! > 0 && <List rows={rows} columns={columns} more={more} linkTo={linkTo} />}
//                 </>
//             )}
//         </MainCard>
//     );
// }

// export default DashboardCard;
