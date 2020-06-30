import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import { Firebase, FirebaseContext } from "./firebase";
import DeviceIdContext from "./contexts/DeviceIdContext";

import { CssBaseline, Container, Box, useTheme } from "@material-ui/core";

import CreateGame from "./views/CreateGame";

import GamePage from "./views/GamePage";

const firebase = new Firebase();

const App: React.FC = () => {
  const [deviceId, setDeviceId] = useState<string>(null);

  const authenticateDevice = () => {
    firebase.auth.signInAnonymously().catch(function (error: any) {
      // Handle Errors here.
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

  const theme = useTheme();
  return (
    <Box bgcolor="background.default">
      <FirebaseContext.Provider value={firebase}>
        <DeviceIdContext.Provider value={deviceId}>
          <>
            <CssBaseline />
            <Container
              maxWidth="lg"
              style={{
                backgroundColor: theme.palette.background.paper,
                minHeight: "100vh",
                padding: 0,
              }}
            >
              <Switch>
                <Route
                  path="/games/:gameId"
                  render={(props) => <GamePage {...props} />}
                />
                <Route exact path="/" render={() => <CreateGame />} />
              </Switch>
            </Container>
            {/* <SettingsContainer />
             */}
          </>
        </DeviceIdContext.Provider>
      </FirebaseContext.Provider>
    </Box>
  );
};

export default App;
