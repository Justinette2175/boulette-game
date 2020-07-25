import React, { useEffect, useState } from "react";

import { Mic, MicOff, Video, VideoOff } from "react-feather";
import { RoundButton } from "../Buttons";

interface ToggleSoundProps {
  track: any;
  kind: "audio" | "video";
}

const ToggleSound: React.FC<ToggleSoundProps> = ({ track, kind }) => {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    setEnabled(track.isEnabled);
    const handleEnabled = () => {
      setEnabled(true);
    };
    const handleDisabled = () => {
      setEnabled(false);
    };
    track.on("disabled", handleDisabled);
    track.on("enabled", handleEnabled);

    return () => {
      setEnabled(false);
      track.removeAllListeners();
    };
  }, [track]);

  const handleClick = () => {
    if (track.isEnabled) {
      track.disable();
    } else {
      track.enable();
    }
  };

  if (!track) {
    return null;
  }

  return (
    <RoundButton
      size="small"
      color="primary"
      onClick={handleClick}
      style={{ marginRight: "4px" }}
    >
      {kind === "audio" && (enabled ? <Mic /> : <MicOff />)}
      {kind === "video" && (enabled ? <Video /> : <VideoOff />)}
    </RoundButton>
  );
};

export default ToggleSound;
