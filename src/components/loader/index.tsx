import { Box, Stack, useTheme } from '@mui/material';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';

function GradientCircularProgress({size}: {size?: number | undefined}) {
  const theme = useTheme();
  return (
      <>
          <svg width={0} height={0}>
              <defs>
                  <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={theme.palette.primary.main} />
                      <stop offset="100%" stopColor={theme.palette.secondary.main} />
                  </linearGradient>
              </defs>
          </svg>
          <CircularProgress
              disableShrink
              size={size}
              sx={{
                  position: 'absolute',
                  left: 0,
                  animationDuration: '550ms',
                  [`& .${circularProgressClasses.circle}`]: {
                      strokeLinecap: 'round'
                  },
                  'svg circle': { stroke: 'url(#my_gradient)' }
              }}
          />
      </>
  );
}

function CustomLoader({size}: {size?: number}) {
  return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: 240 }}>
          <Box sx={{ position: 'relative' }}>
              <CircularProgress
                  variant="determinate"
                  sx={{
                      color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
                  }}
                  size={size ? size : 50}
                  thickness={4}
                  value={100}
              />
              <GradientCircularProgress size={size ? size : 50} />
          </Box>
      </Stack>
  );
}

export default CustomLoader