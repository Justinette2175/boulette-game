const { connect } = require("twilio-video");

class Twillio {
  room: any;
  gameId: string;
  isLargeScreen: boolean;
  onConnected: () => void;
  updatePermissionsModalVisibility: (newState: boolean) => void;
  updateTrackExistence: (
    id: string,
    sid: string,
    type: "audio" | "video",
    exists: boolean
  ) => void;
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
    updateTrackExistence: (
      id: string,
      sid: string,
      type: "audio" | "video",
      exists: boolean
    ) => void,
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
      const room = await connect(token, {
        name: this.gameId,
        audio: true,
        maxAudioBitrate: 16000, //For music remove this line
        video: this.isLargeScreen
          ? { height: 720, frameRate: 24, width: 1280, facingMode: "user" }
          : { height: 480, frameRate: 24, width: 640, facingMode: "user" },
      });

      const localParticipant = room.localParticipant;

      // this.updateTrackExistence(
      //   localParticipant.identity,
      //   localParticipant.sid,
      //   "video",
      //   true
      // );

      this.handleParticipantConnected(localParticipant, true);
      // this.handleParticipantConnected(localParticipant);

      room.participants.forEach((participant: any) => {
        this.handleParticipantConnected(participant);
      });

      room.on("participantConnected", (participant: any) => {
        console.log(`Participant connected: ${participant.identity}`);
        this.handleParticipantConnected(participant);
      });

      room.on("disconnected", (participant: any) => {
        console.log(`Participant disconnected: ${participant}`);
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

  handleParticipantConnected(participant: any, local?: boolean) {
    // this.updateTrackExistence(participant.identity, participant.sid, true);
    console.log("paricipant connected", participant);
    participant.tracks.forEach((publication: any) => {
      console.log("Publication is", publication);
      if (local) {
        this.updateTrackExistence(
          participant.identity,
          participant.sid,
          publication?.track?.kind,
          true
        );
      }
      if (publication.isSubscribed) {
        console.log("publication is subscribed");
        this.updateTrackExistence(
          participant.identity,
          participant.sid,
          publication?.track?.kind,
          true
        );
        this.addTrackEventListeners(publication.track);
      }
      publication.on("subscribed", () => {
        console.log("publication   subscribed", publication);
        this.updateTrackExistence(
          participant.identity,
          participant.sid,
          publication?.track?.kind,
          true
        );
        this.addTrackEventListeners(publication.track);
      });
      publication.on("unsubscribed", () => {
        this.updateTrackExistence(
          participant.identity,
          participant.sid,
          publication?.track?.kind,
          false
        );
        console.log("publication   u nsubscribed", publication);
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
        } else {
          if (!element) {
            throw new Error(`Element to attach track ${elementId} not found`);
          }
          if (!publication.track) {
            throw new Error(
              `publication.track to attach track ${elementId} not found`
            );
          }
        }
      });

      participant.on("trackSubscribed", (track: any) => {
        console.log("Handling track subscribed");
        const element = document.getElementById(elementId);
        if (element) {
          element.textContent = "";
          element.appendChild(track.attach());
        } else {
          throw new Error(`Element to attach track ${elementId} not found`);
        }
      });
    } catch (e) {
      console.log("Error:Twillio:attachParticipantMedia", e);
    }
  }

  addTrackEventListeners(track: any) {
    track.on("enabled", () => {
      console.log("Track enabled", track);
    });
    track.on("disabled", () => {
      console.log("Track disabled", track);
      /* Hide the associated <video> element and show an avatar image. */
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
