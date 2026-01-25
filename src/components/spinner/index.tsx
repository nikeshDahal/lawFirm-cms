import Stack from '@mui/material/Stack';
import spinner from '../../assets/images/spinner.gif';

const Spinner = () => (
    <Stack alignItems={'center'} justifyContent={'center'} height={'55vh'}>
        <img src={spinner} alt="loading" />
    </Stack>
);

export default Spinner;
