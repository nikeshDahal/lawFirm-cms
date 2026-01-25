// import { useQuery } from '@apollo/client';

// const useGQL = () => {
//     const GET_USERS = () =>
//         useQuery<UserResponse, GetAppUsersDTO>(GET_ALL_APP_USERS_DASHBOARD, {
//             variables: {
//                 input: { limit: 10, skip: 0, order: 'desc', orderBy: 'createdAt' }
//             },
//             notifyOnNetworkStatusChange: true
//         });
//     const GET_SUBSCRIPTION_STATS = () =>
//         useQuery<SubscriptionStatsResponse>(GET_SUB_STATS, {
//             fetchPolicy: 'network-only'
//         });
//     return {
//         GET_USERS,
//         GET_SUBSCRIPTION_STATS
//     };
// };

// export default useGQL;
