import Store from "../../redux/store";
import { updateJitsyId } from "../../redux/computer";

const options = {
  hosts: {
    domain: "meet.jitsi",
    muc: "muc.meet.jitsi",
  },
  serviceUrl: "https://jitsi.boulette.ca/http-bind",
};

const token = "2de64e29e2251ace115286bf7c86ca17";

const confOptions = {
  openBridgeChannel: true,
};

const initOptions = {
  disableAudioLevels: true,
};

const win = window as any;
const JitsiMeetJS = win.JitsiMeetJS;
JitsiMeetJS.init(initOptions);
JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);

class Jitsy {
  connection: any;
  isJoined: boolean;
  room: any;
  localTracks: Array<any>;
  remoteTracks: any;
  gameId: string;
  constructor(gameId: string) {
    this.connection = new JitsiMeetJS.JitsiConnection(null, null, options);
    this.gameId = gameId;
    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      this.onConnectionSuccess
    );
    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      this.onConnectionFailed
    );
    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      this.disconnect
    );

    JitsiMeetJS.mediaDevices.addEventListener(
      JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
      this.onDeviceListChanged
    );

    this.connection.connect();

    JitsiMeetJS.createLocalTracks({ devices: ["audio", "video"] })
      .then((tracks: any) => this.onLocalTracks(tracks))
      .catch((error: Error) => {
        throw error;
      });

    this.isJoined = false;
    this.room = null;

    this.localTracks = [];
    this.remoteTracks = {};
  }

  onLocalTracks = (tracks: any) => {
    this.localTracks = tracks;
    for (let i = 0; i < this.localTracks.length; i++) {
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
        (audioLevel: any) => console.log(`Audio Level local: ${audioLevel}`)
      );
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        () => console.log("local track muted")
      );
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
        () => console.log("local track stoped")
      );
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        (deviceId: string) =>
          console.log(`track audio output device was changed to ${deviceId}`)
      );

      if (this.localTracks[i].getType() === "video") {
        const newElement = document.createElement("video");
        newElement.setAttribute("id", `localVideo${i}`);
        newElement.setAttribute("autoplay", "1");
        document.getElementById("video").appendChild(newElement);
        this.localTracks[i].attach(document.getElementById(`localVideo${i}`));
      } else {
        const newElement = document.createElement("audio");
        newElement.setAttribute("id", `localVideo${i}`);
        newElement.setAttribute("autoplay", "1");
        document.getElementById("video").appendChild(newElement);
        this.localTracks[i].attach(document.getElementById(`localAudio${i}`));
      }
      if (this.isJoined) {
        this.room.addTrack(this.localTracks[i]);
      }
    }
  };

  logMyUserId = () => {
    console.log("trying to log");
    if (this.room) {
      console.log("this.room exists");
      const myUserId = this.room.myUserId();
      Store.dispatch(updateJitsyId(myUserId));
    }
  };

  onRemoteTrack = (track: any) => {
    console.log("remote track added!");
    if (track.isLocal()) {
      return;
    }
    const participant = track.getParticipantId();

    if (!this.remoteTracks[participant]) {
      this.remoteTracks[participant] = [];
    }
    const idx = this.remoteTracks[participant].push(track);

    track.addEventListener(
      JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
      (audioLevel: string) => console.log(`Audio Level remote: ${audioLevel}`)
    );
    track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () =>
      console.log("remote track muted")
    );
    track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () =>
      console.log("remote track stoped")
    );
    track.addEventListener(
      JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
      (deviceId: string) =>
        console.log(`track audio output device was changed to ${deviceId}`)
    );
    const id = participant + track.getType() + idx;

    if (track.getType() === "video") {
      const newElement = document.createElement("video");
      newElement.setAttribute("id", `${participant}video${idx}`);
      newElement.setAttribute("autoplay", "1");
      document.getElementById("video").appendChild(newElement);
    } else {
      const newElement = document.createElement("audio");
      newElement.setAttribute("id", `${participant}video${idx}`);
      newElement.setAttribute("autoplay", "1");
      document.getElementById("video").appendChild(newElement);
    }
    track.attach(document.getElementById(`${id}`));
  };

  onConferenceJoined = () => {
    if (!this.isJoined) {
      this.isJoined = true;
      for (let i = 0; i < this.localTracks.length; i++) {
        this.room.addTrack(this.localTracks[i]);
      }
      this.logMyUserId();
    }
  };

  onConnectionSuccess = () => {
    this.room = this.connection.initJitsiConference(
      this.gameId.toLowerCase(),
      confOptions
    );
    this.room.on(JitsiMeetJS.events.conference.TRACK_ADDED, this.onRemoteTrack);
    this.room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, (track: any) => {
      console.log(`track removed!!!${track}`);
    });
    this.room.on(
      JitsiMeetJS.events.conference.CONFERENCE_JOINED,
      this.onConferenceJoined
    );
    this.room.on(JitsiMeetJS.events.conference.USER_JOINED, (id: string) => {
      console.log("user join");
      this.remoteTracks[id] = [];
    });
    this.room.on(JitsiMeetJS.events.conference.USER_LEFT, this.onUserLeft);
    this.room.on(
      JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED,
      (track: any) => {
        console.log(`${track.getType()} - ${track.isMuted()}`);
      }
    );
    this.room.on(
      JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
      (userID: string, displayName: string) =>
        console.log(`${userID} - ${displayName}`)
    );
    this.room.on(
      JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
      (userID: string, audioLevel: string) =>
        console.log(`${userID} - ${audioLevel}`)
    );
    this.room.on(JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED, () =>
      console.log(`${this.room.getPhoneNumber()} - ${this.room.getPhonePin()}`)
    );
    this.room.join();
  };

  onUserLeft = (id: string) => {
    console.log("user left");
    if (!this.remoteTracks[id]) {
      return;
    }
    const tracks = this.remoteTracks[id];

    for (let i = 0; i < tracks.length; i++) {
      tracks[i].detach(document.querySelector(`#${id}${tracks[i].getType()}`));
    }
  };

  disconnect = () => {
    console.log("disconnect!");
    this.connection.removeEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      this.onConnectionSuccess
    );
    this.connection.removeEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      this.onConnectionFailed
    );
    this.connection.removeEventListener(
      JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      this.disconnect
    );
  };

  onConnectionFailed = () => {
    console.error("Connection Failed!");
  };

  /**
   * This function is called when the connection fail.
   */
  onDeviceListChanged(devices: any) {
    console.info("current devices", devices);
  }
}

export default Jitsy;
