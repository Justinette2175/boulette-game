const { connect, createLocalTracks } = require("twilio-video");

class Twillio {
  room: any;
  gameId: string;
  onConnected: () => void;
  updatePermissionsModalVisibility: (newState: boolean) => void;
  updateTrackExistence: (id: string, sid: string, exists: boolean) => void;
  onMuteStateChanged: (
    participantSid: string,
    trackType: "audio" | "video",
    isOn: boolean
  ) => void;

  constructor(
    gameId: string,
    token: string,
    onConnected: () => void,
    updateTrackExistence: (id: string, sid: string, exists: boolean) => void,
    updatePermissionsModalVisibility: (newState: boolean) => void,
    onMuteStateChanged: (
      participantSid: string,
      trackType: "audio" | "video",
      isOn: boolean
    ) => void
  ) {
    this.gameId = gameId;
    this.onConnected = onConnected;
    this.updateTrackExistence = updateTrackExistence;
    this.updatePermissionsModalVisibility = updatePermissionsModalVisibility;
    this.onMuteStateChanged = onMuteStateChanged;

    this.connectToRoom(token);
  }

  async connectToRoom(token: string) {
    try {
      const localTracks = await createLocalTracks({
        audio: true,
        maxAudioBitrate: 16000, //For music remove this line
        video: { height: 720, frameRate: 24, width: 1280 },
        // mobile: video: { height: 480, frameRate: 24, width: 640 }
      });
      const room = await connect(token, {
        name: this.gameId,
        tracks: localTracks,
      });

      const localParticipant = room.localParticipant;
      this.updateTrackExistence(
        localParticipant.identity,
        localParticipant.sid,
        true
      );

      room.participants.forEach((participant: any) => {
        this.updateTrackExistence(participant.identity, participant.sid, true);
      });

      room.on("participantConnected", (participant: any) => {
        console.log(`Participant connected: ${participant.identity}`);
        this.updateTrackExistence(participant.identity, participant.sid, true);
      });

      room.on("disconnected", (participant: any) => {
        console.log(`Participant disconnected: ${participant}`);
        this.updateTrackExistence(participant.identity, null, false);
      });

      this.room = room;
      this.updatePermissionsModalVisibility(false);
      this.onConnected();
    } catch (e) {
      if (e.name === "NotAllowedError") {
        this.updatePermissionsModalVisibility(true);
      }
      console.log("Error:Twillio:connectToRoom", e);
    }
  }

  attachParticipantMedia(sid: string, elementId: string, isLocal?: boolean) {
    try {
      let participant: any;
      if (isLocal) {
        participant = this.room.localParticipant;
      } else {
        participant = this.room.participants.get(sid);
      }
      participant.tracks.forEach((publication: any) => {
        const element = document.getElementById(elementId);
        if (element && publication.track) {
          element.appendChild(publication.track.attach());
        }
      });

      participant.on("trackSubscribed", (track: any) => {
        const element = document.getElementById(elementId);
        if (element) {
          element.appendChild(track.attach());
        }
      });
    } catch (e) {
      console.log("Error:Twillio:attachParticipantMedia", e);
    }
  }

  toggleMute(type: "audio" | "video", isOn: boolean) {
    if (!this.room) {
      return;
    }
    const localParticipant = this.room.localParticipant;
    let tracks;
    if (type === "audio") {
      tracks = localParticipant.audioTracks;
    } else {
      tracks = localParticipant.videoTracks;
    }
    tracks.forEach((publication: any) => {
      if (isOn) {
        publication.track.enable();
      } else {
        publication.track.disable();
      }
    });
    this.onMuteStateChanged(localParticipant.identity, type, isOn);
  }

  leave() {
    console.log("Trying to leave room");
    if (this.room) {
      this.room.disconnect();
    }
  }
}

export default Twillio;
