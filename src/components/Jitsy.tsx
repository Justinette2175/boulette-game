import React, { useEffect } from "react";
import { Box } from "@material-ui/core";

const IFRAME_ID = "jitsy-video";
const JITSY_DOMAIN = "meet.jit.si";

interface IProps {
  jitsyRoomId: string;
  deviceName: string;
}

const Jitsy: React.FC<IProps> = ({ jitsyRoomId, deviceName }) => {
  let api;
  useEffect(() => {
    const win = window as any;
    const domain = JITSY_DOMAIN;
    const options = {
      roomName: jitsyRoomId,
      width: 700,
      height: 700,
      parentNode: document.querySelector(`#${IFRAME_ID}`),
      userInfo: {
        displayName: deviceName,
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
    api = new win.JitsiMeetExternalAPI(domain, options);
    const devices = api.getAvailableDevices();
    console.log("participants are", api._participants);
    console.log("onstage participants", api._onStageParticipant);
    console.log("available devices are", devices);
  }, []);

  return <div id={IFRAME_ID} />;
};

export default Jitsy;
