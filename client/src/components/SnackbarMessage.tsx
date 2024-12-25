import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarMessageProps {
  snackbarOpen: boolean;
  snackbarSeverity: "success" | "error";
  snackbarMessage: string;
  handleSnackbarClose: () => void;
}

const SnackbarMessage: React.FC<SnackbarMessageProps> = ({
  snackbarOpen,
  snackbarSeverity,
  snackbarMessage,
  handleSnackbarClose,
}) => (
  <Snackbar
    open={snackbarOpen}
    autoHideDuration={6000}
    onClose={handleSnackbarClose}
  >
    <Alert
      onClose={handleSnackbarClose}
      severity={snackbarSeverity}
      sx={{ width: "100%" }}
    >
      {snackbarMessage}
    </Alert>
  </Snackbar>
);

export default SnackbarMessage;
