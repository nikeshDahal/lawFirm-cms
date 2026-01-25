import { Stack, Typography } from '@mui/material';
// import spinner from '../../assets/images/error.png';

const FailureLoad = () => (
    <main>
        <Typography variant="h2" component="h1" align="center">
            Data load failed...
        </Typography>
        <Stack height="55vh" justifyContent={'center'} alignItems={'center'} sx={{backgroundColor: "#fff" }}>
            {/* <img height="150%" src={spinner} alt="loading" /> */}
        </Stack>
    </main>
);

export default FailureLoad;
