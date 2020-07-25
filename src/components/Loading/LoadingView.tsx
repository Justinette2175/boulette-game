import React from "react";
import Loader from "./Loader";
import { Box } from "@material-ui/core";

interface LoadingViewProps {}

const LoadingView: React.FC<LoadingViewProps> = () => {
  return (
    <Box
      display="flex"
      minHeight="calc(100vh - 55px)"
      justifyContent="center"
      alignItems="center"
    >
      <Loader />
    </Box>
  );
};

export default LoadingView;
