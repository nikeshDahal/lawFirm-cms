import { Box, Button, ButtonPropsSizeOverrides, Paper, Stack, Typography } from '@mui/material';

type PageTitleProps = {
  title: string,
  hasButton?: boolean,
  children?: any,
  rightAlign?: boolean,
  element?: JSX.Element,
}

export default function PageTitle({title, hasButton, rightAlign, element, children} : PageTitleProps) {
  hasButton = !hasButton ? true : false;
  rightAlign = !rightAlign ? true : false;
  return (
    <Paper className='page-title'>
      {hasButton ? (
        <Stack
        alignItems={'center'}
          flexDirection={{sm: !rightAlign ? 'row-reverse' : 'row'}}
          justifyContent={'space-between'}
        >
          <Typography variant="h2">{title}</Typography>
          <Box>{element}</Box>
        </Stack>) : (
          <Typography variant="h2">{title}</Typography>
        )}
      {children}
    </Paper>
  )
}
