import styled from 'styled-components';
import MainCard from 'ui-component/cards/MainCard';
import { Button as MuiButton } from '@mui/material';

export const CustomMainCard = styled(MainCard)`
    position: relative;
`;

export const Button = styled(({ ...otherProps }) => <MuiButton {...otherProps} />)`
    position: absolute;
    top: 1rem;
    right: 1rem;
`;
