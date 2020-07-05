const { connect, createLocalTracks } = require("twilio-video");

const DEV_TOKEN = process.env.REACT_APP_TWILLIO_ACCESS_TOKEN_DEV;

class Twillio {
  room: any;
  gameId: string;
  onConnected: () => void;
  closePermissionsModal: () => void;
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
    closePermissionsModal: () => void,
    onMuteStateChanged: (
      participantSid: string,
      trackType: "audio" | "video",
      isOn: boolean
    ) => void
  ) {
    this.gameId = gameId;
    this.onConnected = onConnected;
    this.updateTrackExistence = updateTrackExistence;
    this.closePermissionsModal = closePermissionsModal;
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

      room.on("participantDisconnected", (participant: any) => {
        console.log(`Participant disconnected: ${participant.identity}`);
        this.updateTrackExistence(participant.identity, null, false);
      });

      this.room = room;
      this.onConnected();
    } catch (e) {
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
}

export default Twillio;
