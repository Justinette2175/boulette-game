import React from "react";
import { Box } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

interface ErrorProps {
  error?: Error;
}

const Error: React.FC<ErrorProps> = ({ error, children }) => {
  return (
    <Box mb={2}>
      <Alert severity="error">{error ? error.message : children}</Alert>
    </Box>
  );
};

export default Error;
