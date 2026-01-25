import { Grid, InputLabel, TextField } from '@mui/material';
import styled from 'styled-components';

export const GridContainer = styled(({ ...props }) => <Grid {...props} />)`
    position: absolute;
    right: 0;
    top: 12px;
    display: flex;
    justify-content: flex-end;
`;

export const MainWrapper = styled.div`
    //  margin: 0 3.5rem;
    width: inherit;
`;

export const CustomTextField = styled(({ ...props }) => <TextField {...props} />)`
    width: 500px;
    @media (max-width: 520px) {
        width: 100%;
    }
`;

export const Label = styled(({ ...props }) => <InputLabel {...props} />)`
    color: rgba(0, 0, 0, 0.6);
    padding: 0.4em;
`;

export const ChipWrapper = styled.div`
    padding: 0.5em;
    display: inline-grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1rem;
    margin-bottom: 1rem;
`;
