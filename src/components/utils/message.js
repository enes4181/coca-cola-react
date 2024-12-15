import { useState, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('error');
  const [autoHideDuration, setAutoHideDuration] = useState(6000);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const errorMessage = useCallback((msg) => {
    setMessage(msg);
    setSeverity('error');
    setAutoHideDuration(4000);
    setOpen(true);
  }, []);

  const successMessage = useCallback((msg) => {
    setMessage(msg);
    setSeverity('success');
    setAutoHideDuration(4000);
    setOpen(true);
  }, []);

  const SnackbarComponent = (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} variant="filled" severity={severity} sx={{ width: '100%' }}>
        <AlertTitle>{severity === 'error' ? 'Hata' : 'Başarılı'}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );

  return { errorMessage, successMessage, SnackbarComponent };
};

export default useSnackbar;