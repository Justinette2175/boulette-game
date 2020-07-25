import React from "react";
import { Box } from "@material-ui/core";

interface LoaderProps {}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <Box>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Box>
  );
};

export default Loader;
