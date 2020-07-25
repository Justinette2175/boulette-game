import React, { useEffect, useState } from "react";
import Video from "twilio-video";

import { ArrowRightCircle } from "react-feather";
import { RoundButton } from "../Buttons";

interface ToggleCameraProps {
  participant: any;
}

const ToggleCamera: React.FC<ToggleCameraProps> = ({ participant }) => {
  const [devices, setDevices] = useState<Array<any>>(null);
  const [cameraIndex, setIndex] = useState<number>(0);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setDevices(devices.filter((d) => d.kind === "videoinput"));
    });
    const tracks = Array.from(participant.videoTracks.values());
    console.log("tracks", tracks);
  }, []);

  const changeCamera = (deviceId: string) => {
    Video.createLocalVideoTrack({
      deviceId: { exact: deviceId },
    }).then((localVideoTrack: any) => {
      participant.videoTracks.forEach((publication: any) => {
        publication.unpublish();
      });
      participant.publishTrack(localVideoTrack);
    });
  };

  const handleClick = () => {
    const newIndex = cameraIndex + 1 > devices.length - 1 ? 0 : cameraIndex + 1;
    changeCamera(devices[newIndex].deviceId);
    setIndex(newIndex);
  };

  if (!devices) {
    return null;
  }

  return (
    <RoundButton
      size="small"
      color="primary"
      onClick={handleClick}
      style={{ marginRight: "4px" }}
    >
      <ArrowRightCircle />
    </RoundButton>
  );
};

export default ToggleCamera;
