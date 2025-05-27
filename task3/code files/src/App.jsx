import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { theme } from './theme';
import Calendar from './components/Calendar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
            <Box
              sx={{
                textAlign: 'center',
                mb: 4,
                color: 'white',
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Event Calendar
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 300,
                  opacity: 0.9,
                }}
              >
                Manage your schedule with ease
              </Typography>
            </Box>
            <Calendar />
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
