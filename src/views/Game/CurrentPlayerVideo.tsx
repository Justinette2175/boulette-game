import React from "react";
import { Box } from "@material-ui/core";
import useCurrentPlayerIsOnDevice from "../../utils/useCurrentPlayerIsOnDevice";
import { VIDEO_HEIGHT } from "../../constants";

const IFRAME_ID = "jitsy-video";

const CurrentPlayerVideo = () => {
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();
  return (
    <Box
      position="fixed"
      height={VIDEO_HEIGHT}
      maxHeight="80vh"
      width="100%"
      bottom={0}
      right={0}
      zIndex={0}
      style={{
        backgroundColor: "black",
        transition: "all 1s",
        transformOrigin: "100% 100%",
        transform: `translateY(${currentPlayerIsOnDevice ? "100%" : "0%"}) `,
      }}
      display="flex"
      justifyContent="center"
    >
      <Box id={IFRAME_ID} />
    </Box>
  );
};

export default CurrentPlayerVideo;
