import React, { useEffect, useState, useRef } from "react";
import { Box } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Mic, MicOff } from "react-feather";
import { RoundButton } from "../Buttons";
import ToggleSound from "./ToggleSound";
import ToggleCamera from "./ToggleCamera";

interface StyleProps {
  large?: boolean;
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      height: ({ large }: StyleProps) => (large ? "400px" : "110px"),
      width: ({ large }: StyleProps) => (large ? "100%" : "165px"),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "black",
      [theme.breakpoints.up("md")]: {
        height: ({ large }: StyleProps) => (large ? "600px" : "120px"),
        width: ({ large }: StyleProps) => (large ? "auto" : "180px"),
      },
      "& video": {
        maxHeight: "100%",
        maxWidth: ({ large }: StyleProps) => (large ? "auto" : "200px"),
        transform: "rotateY(180deg)",
      },
    },
  });
});

interface IProps {
  participant: any;
  local?: boolean;
  large?: boolean;
}

const Participant: React.FC<IProps> = ({ participant, local, large }) => {
  const classes = useStyles({ large });
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap: Array<any>) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  // const sid = track?.sid || null;

  useEffect(() => {
    const trackSubscribed = (track: any) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track: any) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    if (participant) {
      setVideoTracks(trackpubsToTracks(participant.videoTracks));
      setAudioTracks(trackpubsToTracks(participant.audioTracks));

      participant.on("trackSubscribed", trackSubscribed);
      participant.on("trackUnsubscribed", trackUnsubscribed);

      return () => {
        setVideoTracks([]);
        setAudioTracks([]);
        participant.removeAllListeners();
      };
    }
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  if (!participant) {
    return null;
  }

  const audioPublication: any = Array.from(participant.audioTracks.values())[0];
  const audioTrack = audioPublication ? audioPublication.track : null;
  const videoPublication: any = Array.from(participant.videoTracks.values())[0];
  const videoTrack = videoPublication ? videoPublication.track : null;

  return (
    <Box position="relative">
      <Box className={classes.container}>
        <video ref={videoRef} autoPlay={true} />
        <audio ref={audioRef} autoPlay={true} />
      </Box>
      {local && (
        <Box position="absolute" p={0.5} style={{ bottom: 0, left: 0 }}>
          <ToggleSound kind="audio" track={audioTrack}></ToggleSound>
          <ToggleSound kind="video" track={videoTrack}></ToggleSound>
          {/* <ToggleCamera participant={participant} /> */}
        </Box>
      )}
    </Box>
  );
};

export default Participant;
