import { useState } from 'react';

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    snackbarOpen: false,
    snackbarMessage: '',
    snackbarSeverity: 'success' as 'success' | 'error',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      snackbarOpen: true,
      snackbarMessage: message,
      snackbarSeverity: severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, snackbarOpen: false }));
  };

  return {
    snackbar: { ...snackbar, handleSnackbarClose },
    showSnackbar,
  };
};