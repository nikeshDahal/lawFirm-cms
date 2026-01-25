import { Box, BoxProps } from '@mui/material';

interface RightAlignedWrapperProps extends BoxProps {}

const RightAlignedWrapper: React.FC<RightAlignedWrapperProps> = ({ children, ...props }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }} {...props}>
            {children}
        </Box>
    );
};

export default RightAlignedWrapper;
