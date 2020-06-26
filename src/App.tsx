import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import { Firebase, FirebaseContext } from "./firebase";
import GameIdContext from "./contexts/GameIdContext";
import DeviceIdContext from "./contexts/DeviceIdContext";

import { Store, GameStages } from "./types";
import { FirebaseGame } from "./types/firebaseTypes";

import { CssBaseline, Box, useMediaQuery, useTheme } from "@material-ui/core";
import { JitsiProvider } from "./utils/JitsiContext";

import StartOrJoinGame from "./views/StartOrJoinGame";
import AddWordsView from "./views/AddWordsView";
import Game from "./views/Game";
import Background from "./components/Background";
import GameEnded from "./views/GameEnded";
import WaitingForPlayersView from "./views/WaitingForPlayersView";
import ViewTeamsView from "./views/ViewTeamsView";
import SmallScreenView from "./views/SmallScreenView";

import PermissionsModal from "./components/PermissionsModal";

import SettingsContainer from "./components/SettingsContainer";
import GameContext from "./contexts/GameContext";
import GamePage from "./views/GamePage";

const firebase = new Firebase();

const App: React.FC = () => {
  const [deviceId, setDeviceId] = useState<string>(null);

  const authenticateDevice = () => {
    firebase.auth.signInAnonymously().catch(function (error: any) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  };

  const listenToAuthenticatedDevice = () => {
    firebase.auth.onAuthStateChanged(function (user: any) {
      if (user) {
        setDeviceId(user.uid);
      } else {
        authenticateDevice();
      }
    });
  };

  useEffect(() => {
    listenToAuthenticatedDevice();
  }, []);

  return (
    <div className="App">
      {/* <JitsiProvider gameId={gameId}> */}
      <FirebaseContext.Provider value={firebase}>
        <DeviceIdContext.Provider value={deviceId}>
          <>
            <CssBaseline />
            {/* <Background /> */}
            <Box
              style={{
                position: "relative",
                minHeight: "100vh",
                width: "100vw",
                overflow: "auto",
              }}
            >
              <Switch>
                <Route
                  path="/games/:gameId"
                  render={(props) => <GamePage {...props} />}
                />
                <Route
                  exact
                  path="/"
                  render={(props) => <StartOrJoinGame {...props} />}
                />
              </Switch>
            </Box>
            {/* <SettingsContainer />
          <PermissionsModal /> */}
          </>
          {/* </JitsiProvider> */}
        </DeviceIdContext.Provider>
      </FirebaseContext.Provider>
    </div>
  );
};

export default App;
