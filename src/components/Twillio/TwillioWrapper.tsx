import React, { useEffect, useState, useContext } from "react";
import DeviceIdContext from "../../contexts/DeviceIdContext";
import { FirebaseContext } from "../../firebase";
import Video from "twilio-video";

import GameContext from "../../contexts/GameContext";
import TwillioContext from "../../contexts/TwillioContext";
import DisplayVideoContext from "../../contexts/DisplayVideoContext";

import PermissionsModal from "../PermissionsModal";

interface IProps {}

export const TwillioWrapper: React.FC<IProps> = ({ children }) => {
  const game = useContext(GameContext);
  const deviceId = useContext(DeviceIdContext);
  const firebase = useContext(FirebaseContext);
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [permissionModalVisible, setPermissionModalVisible] = useState<boolean>(
    false
  );

  const [_, setDisplayVideo] = useContext(DisplayVideoContext);

  const initiateCall = async () => {
    try {
      const tokenData = await firebase.functions.httpsCallable(
        "generateTwillioToken"
      )({ gameId: game.id, deviceId });
      const token = tokenData.data;
      const participantConnected = (participant: any) => {
        setParticipants((prevParticipants) => [
          ...prevParticipants,
          participant,
        ]);
      };
      const participantDisconnected = (participant: any) => {
        setParticipants((prevParticipants) =>
          prevParticipants.filter((p) => p !== participant)
        );
      };
      Video.connect(token, {
        name: game.id,
      }).then((room: any) => {
        setRoom(room);
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);
      });

      return () => {
        setRoom((currentRoom: any) => {
          if (
            currentRoom &&
            currentRoom.localParticipant.state === "connected"
          ) {
            currentRoom.localParticipant.tracks.forEach(function (
              trackPublication: any
            ) {
              trackPublication.track.stop();
            });
            currentRoom.disconnect();
            return null;
          } else {
            return currentRoom;
          }
        });
      };
    } catch (e) {
      console.log("Error:TwillioWrapper:initiateCall", e);
    }
  };

  useEffect(() => {
    if (!room && game?.numberOfDevices > 0) {
      initiateCall();
      setDisplayVideo(true);
    }
  }, [game?.id, game?.numberOfDevices]);

  return (
    <TwillioContext.Provider value={[room, participants]}>
      {children}
      <PermissionsModal
        open={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
      />
    </TwillioContext.Provider>
  );
};

export default TwillioWrapper;
