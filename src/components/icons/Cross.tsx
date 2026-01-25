import { useTheme } from "@mui/material";
import { ThemeMode } from "types/config";

const Cross = () => {
const theme = useTheme();
const mode = theme.palette.mode;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" fill="none" viewBox="0 0 16 17">
            <path
                fill={mode === ThemeMode.DARK ? '#fff' : '#212121'}
                d="M.397 1.054L.47.97a.75.75 0 01.976-.073L1.53.97 8 7.439l6.47-6.47a.75.75 0 111.06 1.061L9.061 8.5l6.47 6.47a.75.75 0 01.072.976l-.073.084a.75.75 0 01-.976.073l-.084-.073L8 9.561l-6.47 6.47A.75.75 0 01.47 14.97L6.939 8.5.469 2.03a.75.75 0 01-.072-.976L.47.97l-.073.084z"
            ></path>
        </svg>
    );};

export default Cross;
