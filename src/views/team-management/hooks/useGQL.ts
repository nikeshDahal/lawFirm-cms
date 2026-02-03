import { useMutation, useQuery } from '@apollo/client';
import {
    GET_USER_PROFILE,
    CREATE_TEAM_MUTATION,
    GET_ALL_TEAMS,
    GET_TEAM_DETAIL,
    UPDATE_TEAM_MUTATION,
    REMOVE_TEAM_MUTATION
} from '../graphql';

export const useGQL = () => {
    const CREATE_TEAM = () => useMutation(CREATE_TEAM_MUTATION);

    const GET_ADMIN_PROFILE = () => useQuery(GET_USER_PROFILE);
    const GET_TEAMS_LIST = () =>
        useQuery(GET_ALL_TEAMS, {
            variables: {
                input: {}
            },
            notifyOnNetworkStatusChange: true
        });
    const GET_TEAM = (teamId: string) =>
        useQuery(GET_TEAM_DETAIL, {
            variables: {
                findTeamByIdId: teamId
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only'
        });
    const UPDATE_TEAM = () => useMutation(UPDATE_TEAM_MUTATION);
    const REMOVE_TEAM = () => useMutation(REMOVE_TEAM_MUTATION);

    return {
        CREATE_TEAM,
        UPDATE_TEAM,
        GET_ADMIN_PROFILE,
        GET_TEAMS_LIST,
        GET_TEAM,
        REMOVE_TEAM
    };
};
