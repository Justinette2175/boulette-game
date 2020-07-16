import React, { useContext, useState } from "react";
import { Dialog, Box, Typography } from "@material-ui/core";
import COPY from "../copy";

import TwillioContext from "../contexts/TwillioContext";
import useInterval from "../utils/useInterval";

const CHECK_PERMISSIONS_INTERVAL = 1000;

interface IProps {
  open: boolean;
  onClose: () => void;
}

const PermissionsModal: React.FC<IProps> = ({ open, onClose }) => {
  const language = "EN";

  const [twillio] = useContext(TwillioContext);

  if (!twillio) {
    return null;
  }
  return (
    <Dialog open={open} maxWidth="md" PaperProps={{ elevation: 0 }}>
      <Box p={6}>
        <Typography variant="h2">
          {COPY.ENABLE_MEDIA_TITLE[language]}
        </Typography>
        <Typography variant="body1">
          {COPY.ENABLE_MEDIA_CONTENT[language]}
        </Typography>
      </Box>
    </Dialog>
  );
};

export default PermissionsModal;
