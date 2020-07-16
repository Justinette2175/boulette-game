const { connect, createLocalTracks } = require("twilio-video");

class Twillio {
  room: any;
  gameId: string;
  isLargeScreen: boolean;
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
    isLargeScreen: boolean,
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
    this.isLargeScreen = isLargeScreen;
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
        video: this.isLargeScreen
          ? { height: 720, frameRate: 24, width: 1280, facingMode: "user" }
          : { height: 480, frameRate: 24, width: 640, facingMode: "user" },
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
        this.handleParticipantConnected(participant);
      });

      room.on("participantConnected", (participant: any) => {
        console.log(`Participant connected: ${participant.identity}`);
        this.handleParticipantConnected(participant);
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

  handleParticipantConnected(participant: any) {
    this.updateTrackExistence(participant.identity, participant.sid, true);
    participant.tracks.forEach((publication: any) => {
      if (publication.isSubscribed) {
        this.handleTrackDisabled(publication.track);
      }
      publication.on("subscribed", () => {
        this.handleTrackDisabled(publication.track);
      });
      publication.on("unsubscribed", () => {
        console.log("publication   u nsubscribed");
      });
    });
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
          element.textContent = "";
          element.appendChild(publication.track.attach());
        }
      });

      participant.on("trackSubscribed", (track: any) => {
        const element = document.getElementById(elementId);
        if (element) {
          element.textContent = "";
          element.appendChild(track.attach());
        }
      });
    } catch (e) {
      console.log("Error:Twillio:attachParticipantMedia", e);
    }
  }

  handleTrackDisabled(track: any) {
    track.on("disabled", () => {
      console.log("Track disabled", track);
      /* Hide the associated <video> element and show an avatar image. */
    });
  }

  handleTrackEnabled(track: any) {
    track.on("enabled", () => {
      console.log("Track enabled", track);
    });
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
