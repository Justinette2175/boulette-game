import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import { Firebase, FirebaseContext } from "./firebase";
import DeviceIdContext from "./contexts/DeviceIdContext";
import DisplayVideoContext from "./contexts/DisplayVideoContext";
import { red, deepPurple } from "@material-ui/core/colors";

import { CssBaseline, Container, Box, useTheme } from "@material-ui/core";

import CreateGame from "./views/CreateGame";

import GamePage from "./views/GamePage";

import HomePage from "./views/Home";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import BuyCode from "./views/BuyCode";
import Navbar from "./components/Navbar";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    bg: {
      minHeight: "100vh",
      backgroundColor: theme.palette.primary.dark,
    },
    container: {
      backgroundColor: theme.palette.background.default,
      minHeight: "100vh",
      maxHeight: "100vh",
      display: "flex",
      flexDirection: "column",

      overflowY: "auto",
      overflowX: "hidden",
    },
  });
});

const firebase = new Firebase();

const App: React.FC = () => {
  const [deviceId, setDeviceId] = useState<string>(null);
  const [displayVideos, setDisplayVideos] = useState<boolean>(null);

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

  const classes = useStyles();
  return (
    <Box bgcolor="background.default">
      <Box className={classes.bg}>
        <FirebaseContext.Provider value={firebase}>
          <DeviceIdContext.Provider value={deviceId}>
            <DisplayVideoContext.Provider
              value={[displayVideos, (newVal) => setDisplayVideos(newVal)]}
            >
              <>
                <CssBaseline />
                <Container
                  className={classes.container}
                  disableGutters
                  maxWidth="lg"
                >
                  <Navbar
                    hasVideo={displayVideos !== null}
                    toggleDisplayVideos={() =>
                      setDisplayVideos((prev: boolean) => !prev)
                    }
                  ></Navbar>
                  <Box
                    flexGrow={1}
                    alignItems="stretch"
                    display="flex"
                    flexDirection="column"
                  >
                    <Switch>
                      <Route
                        exact
                        path="/games/new"
                        render={() => <CreateGame />}
                      />
                      <Route
                        path="/games/:gameId"
                        render={(props) => <GamePage {...props} />}
                      />
                      <Route
                        exact
                        path="/buycode"
                        render={(props) => <BuyCode {...props} />}
                      />
                      <Route exact path="/" component={HomePage} />
                    </Switch>
                  </Box>
                </Container>
                {/* <SettingsContainer />
                 */}
              </>
            </DisplayVideoContext.Provider>
          </DeviceIdContext.Provider>
        </FirebaseContext.Provider>
      </Box>
    </Box>
  );
};

export default App;
