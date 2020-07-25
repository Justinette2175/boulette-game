import React from "react";
import { Box, Typography, useTheme, Button } from "@material-ui/core";
import { Frown } from "react-feather";
import { NextButton } from "../Buttons";
import { Link } from "react-router-dom";

interface ErrorViewProps {
  error?: Error;
  title?: string;
  paragraph?: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  title,
  paragraph,
  children,
}) => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={4}
      width="100%"
    >
      <Box mb={2}>
        <Frown size={100} color={theme.palette.primary.main} />
      </Box>
      <Box maxWidth="600px">
        <Typography align="center" variant="h2">
          {title || children}
        </Typography>
        {paragraph && <Typography>{paragraph}</Typography>}
      </Box>
      <NextButton>
        <Button component={Link} to="/" variant="contained" color="primary">
          Go home
        </Button>
      </NextButton>
    </Box>
  );
};

export default ErrorView;
