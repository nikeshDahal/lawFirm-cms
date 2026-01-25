import { CardContent, Grid, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type Props = {
    debouncedSearch: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => void;
};

export const FilterList = ({ debouncedSearch }: Props) => {
    return (
        <CardContent>
            <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            )
                        }}
                        onChange={debouncedSearch}
                        placeholder="Search"
                        size="small"
                    />
                </Grid>
            </Grid>
        </CardContent>
    );
};
