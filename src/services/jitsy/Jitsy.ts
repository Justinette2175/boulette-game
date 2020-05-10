import GameService from "../game";

const options = {
  hosts: {
    domain: "meet.jitsi",
    muc: "muc.meet.jitsi",
  },
  serviceUrl: "https://jitsi.boulette.ca/http-bind",
};

// const token = "2de64e29e2251ace115286bf7c86ca17";

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
  videoComponents: any;
  audioComponents: any;
  addExistingTrackId: (id: string) => void;
  setHasLocalTrack: (val: boolean) => void;
  constructor(
    gameId: string,
    addExistingTrackId: (id: string) => void,
    setHasLocalTrack: (val: boolean) => void
  ) {
    this.connection = new JitsiMeetJS.JitsiConnection(null, null, options);
    this.gameId = gameId;
    this.videoComponents = {};
    this.audioComponents = {};
    this.addExistingTrackId = addExistingTrackId;
    this.setHasLocalTrack = setHasLocalTrack;
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
    console.log("connection", this.connection);
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
    this.setHasLocalTrack(true);

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

      if (this.isJoined) {
        this.room.addTrack(this.localTracks[i]);
      }
    }
  };

  logMyUserId = () => {
    if (this.room) {
      const myUserId = this.room.myUserId();
      GameService.storeJitsyId(myUserId);
    }
  };

  onRemoteTrack = (track: any) => {
    if (track.isLocal()) {
      return;
    }
    const participantId = track.getParticipantId();

    if (!this.remoteTracks[participantId]) {
      this.remoteTracks[participantId] = [];
    }

    this.remoteTracks[participantId].push(track);
    this.addExistingTrackId(participantId);

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
  };

  attachLocalTrackToComponent = (componentId: string) => {
    const localWrapper = document.getElementById(componentId);
    this._attachTrackToComponent(this.localTracks, localWrapper);
  };

  attachRemoteTrackToComponent = (
    participantId: string,
    componentId: string
  ) => {
    const participantTracks = this.remoteTracks[participantId];
    const participantWrapper = document.getElementById(componentId);
    this._attachTrackToComponent(participantTracks, participantWrapper);
  };

  _attachTrackToComponent = (tracks: Array<any>, wrapper: any) => {
    if (tracks && tracks.length > 0) {
      if (wrapper) {
        let component: any;
        tracks.forEach((track: any) => {
          const trackType = track.getType();
          if (trackType === "video") {
            component = wrapper.querySelectorAll("video");
          }
          if (trackType === "audio") {
            component = wrapper.querySelectorAll("audio");
          }
          if (component) {
            track.attach(component[0]);
          } else {
            console.warn(
              "Could not find a component to insert track of type " + trackType
            );
          }
        });
      } else {
        throw new Error("Could not find a track wrapper with that ID");
      }
    } else {
      throw new Error("Could not find track for user.");
    }
  };

  onConferenceJoined = () => {
    console.log("On conference joined");
    if (!this.isJoined) {
      this.isJoined = true;
      for (let i = 0; i < this.localTracks.length; i++) {
        this.room.addTrack(this.localTracks[i]);
      }
    }
    this.logMyUserId();
  };

  onConnectionSuccess = () => {
    console.log("Connection established");
    this.room = this.connection.initJitsiConference(
      this.gameId.toLowerCase(),
      confOptions
    );
    console.log("This.room", this.room);
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
