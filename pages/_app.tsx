import 'styles/globals.css';

import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { initSettings } from 'api/settings';
import type { AppProps } from 'next/app';
import React from 'react';
import { setAxiosDefault } from 'utils/axios';

export type PagePropsType = {
  mode: 'light' | 'dark';
  setMode: (arg: 'light' | 'dark') => void;
};

function MyApp({ Component, pageProps }: AppProps) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
    components: {
      MuiTypography: {
        defaultProps: {
          color: 'text.primary',
        },
      },
      MuiButton: {
        defaultProps: {
          variant: 'contained',
          color: 'primary',
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#2A2A2A',
      },
    },
    components: {
      MuiTypography: {
        defaultProps: {
          color: '#bdbdbd',
        },
      },
      MuiButton: {
        defaultProps: {
          variant: 'contained',
          color: 'primary',
        },
      },
    },
  });

  React.useEffect(() => {
    initSettings();
    setAxiosDefault();
  }, []);

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <Component {...pageProps} setMode={setMode} mode={mode} />
    </ThemeProvider>
  );
}

export default MyApp;
