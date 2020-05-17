import React, { useContext, useState } from "react";
import { Dialog, Box, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Store } from "../types";
import COPY from "../copy";
import { updatePermissionsModal } from "../redux/computer";

import JitsyContext from "../utils/JitsiContext";
import useInterval from "../utils/useInterval";

const CHECK_PERMISSIONS_INTERVAL = 1000;

const PermissionsModal = () => {
  const dispatch = useDispatch();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const open = useSelector((state: Store) => state.computer.permissionsModal);
  const language = useSelector((state: Store) => state.computer.language);

  const { jitsy } = useContext(JitsyContext);

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
        if (ok) {
          await jitsy.createLocalTracks();
          dispatch(updatePermissionsModal(false));
          setHasPermission(true);
        }
      };
      checkPermissions();
    },
    hasPermission ? null : CHECK_PERMISSIONS_INTERVAL
  );

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

const PermissionsModalContainer = () => {
  const { jitsy } = useContext(JitsyContext);
  if (!!jitsy) {
    return <PermissionsModal />;
  } else {
    return null;
  }
};

export default PermissionsModalContainer;
