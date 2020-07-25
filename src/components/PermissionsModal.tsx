import React from "react";
import { Dialog, Box, Typography } from "@material-ui/core";
import COPY from "../copy";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const PermissionsModal: React.FC<IProps> = ({ open, onClose }) => {
  const language = "EN";
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
