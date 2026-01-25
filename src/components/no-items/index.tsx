import { Box, Typography, useTheme } from '@mui/material'

import noitems from 'assets/images/no-item.svg'
import noitemsDark from 'assets/images/no-item-dark.svg'
import { ThemeMode } from 'types/config';

function Noitems() {
    const theme = useTheme();
    const mode = theme.palette.mode;
  return (
      <>
          <Box
              sx={{
                  maxWidth: 500,
                  margin: '0 auto',
                  img: {
                      veritcalAlign: 'top',
                      width: '100%',
                      height: 'auto'
                  }
              }}
          >
              <img src={mode === ThemeMode.DARK ? noitemsDark : noitems } />
          </Box>
          <Typography variant="h2" align="center" my={2}>
              No items found
          </Typography>
      </>
  );
}

export default Noitems