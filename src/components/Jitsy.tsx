import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import useCurrentPlayerIsOnDevice from "../utils/useCurrentPlayerIsOnDevice";
import { Store } from "../types";
import { useSelector } from "react-redux";
import { VIDEO_HEIGHT } from "../constants";

const IFRAME_ID = "jitsy-video";
const JITSY_DOMAIN = "meet.jit.si";

const Jitsy: React.FC = () => {
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();
  const gameId = useSelector((state: Store) => state.game.id);
  const [api, setApi] = useState<any>(null);

  const launchJitsy = () => {
    const win = window as any;
    const domain = JITSY_DOMAIN;
    const options = {
      roomName: gameId,
      width: 700,
      height: 700,
      parentNode: document.querySelector(`#${IFRAME_ID}`),
      userInfo: {
        displayName: "",
      },
      interfaceConfigOverwrite: {
        MOBILE_APP_PROMO: false,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "fodeviceselection",
          "videoquality",
          // "filmstrip",
        ],
        SETTINGS_SECTIONS: ["devices", "moderator"],
      },
    };
    const a = new win.JitsiMeetExternalAPI(domain, options);
    setApi(a);
  };

  useEffect(() => {
    launchJitsy();
    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, []);

  return (
    <Box
      position="absolute"
      width="100vw"
      height={VIDEO_HEIGHT}
      bottom={0}
      left={0}
      style={{
        backgroundColor: "black",
        transition: "all 1s",
        transform: `translateY(${currentPlayerIsOnDevice ? "50%" : "0%"})`,
      }}
      display="flex"
      justifyContent="center"
    >
      <Box
        style={{
          transformOrigin: "50% 0%",
          transform: `scale(${currentPlayerIsOnDevice ? "50%" : "100%"})`,
        }}
        id={IFRAME_ID}
      />
    </Box>
  );
};

export default Jitsy;
