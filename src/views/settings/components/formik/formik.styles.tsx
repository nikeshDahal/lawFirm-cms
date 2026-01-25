import { IconButton } from '@mui/material';
import styled from 'styled-components';

export const ImageWrapper = styled.div`
    height: 120px;
    padding: 1rem;
    position: relative;
`;

export const IconButtonWrapper = styled(({ imageSet, ...props }) => <IconButton {...props} />)`
    position: absolute;
    left: 0.5rem;
    top: 0.5rem;
    color: #fff;
    display: ${(props) => (props.imageSet ? '' : 'none')};
`;

export const Image = styled(({ ...props }) => <img {...props} />)`
    height: 100%;
`;
