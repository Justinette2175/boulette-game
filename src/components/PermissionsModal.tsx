import React, { useContext, useState } from "react";
import { Dialog, Box, Typography } from "@material-ui/core";
import COPY from "../copy";

import JitsyContext from "../contexts/JitsiContext";
import useInterval from "../utils/useInterval";

const CHECK_PERMISSIONS_INTERVAL = 1000;

interface IProps {
  open: boolean;
  onClose: () => void;
}

const PermissionsModal: React.FC<IProps> = ({ open, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const language = "EN";

  const [jitsi] = useContext(JitsyContext);

  const hasAllMediaPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      return true;
    } catch (e) {
      return false;
    }
  };

  useInterval(
    () => {
      const checkPermissions = async () => {
        const ok = await hasAllMediaPermissions();
        if (ok && jitsi) {
          await jitsi.createLocalTracks();
          onClose();
          setHasPermission(true);
        }
      };
      checkPermissions();
    },
    hasPermission ? null : CHECK_PERMISSIONS_INTERVAL
  );

  if (!jitsi) {
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
