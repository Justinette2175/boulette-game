import React, { useContext, useState } from "react";
import { Formik, Form } from "formik";
import { Redirect } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import { NewGame } from "../../types/firebaseTypes";
import * as Yup from "yup";
import { generateGameId } from "../../utils";
import moment from "moment";

import { Button, Typography, Box } from "@material-ui/core";
import TextInput from "../../components/TextInput";
import Select from "../../components/Select";
import ButtonsGroup from "../../components/ButtonsGroup";

import COPY from "../../copy";
import DeviceIdContext from "../../contexts/DeviceIdContext";

import iss from "../../assets/images/iss.png";
import { ViewWrapper, LighterBox } from "../../components/Containers";
import { H1 } from "../../components/Typography";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    leftBox: {
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("sm")]: {
        maxWidth: "400px",
        marginRight: theme.spacing(2),
      },
    },
    h1: {
      [theme.breakpoints.down("xs")]: {
        maxWidth: "300px",
      },
    },
    rightBox: {
      flex: 0,
      [theme.breakpoints.up("sm")]: {
        maxWidth: "400px",
        flex: 3,
      },
    },
    imageWrapper: {
      [theme.breakpoints.down("xs")]: {
        position: "absolute",
        top: "48px",
        left: "58%",
        width: "160px",
      },
    },
  });
});

const MAX_NUMBER_OF_DEVICES_FOR_UNPAID = 2;

interface FormValues {
  ownerName: string;
  wordsPerPlayer: number;
  secondsPerTurn: number;
}

const StartGame: React.FC = () => {
  const language = "EN";
  const firebase = useContext(FirebaseContext);
  const deviceId = useContext(DeviceIdContext);
  const [gameId, setGameId] = useState<string>(null);
  const [error, setError] = useState<Error>(null);

  const validationSchema = Yup.object().shape({
    ownerName: Yup.string().required("Required"),
    wordsPerPlayer: Yup.number().required("Required"),
    secondsPerTurn: Yup.number().required("Required"),
  });

  const createGame = async ({
    wordsPerPlayer,
    secondsPerTurn,
    ownerName,
  }: FormValues) => {
    try {
      const batch = firebase.firestore().batch();
      const gameShortId = generateGameId();

      const gameRef = firebase.firestore().collection("games").doc();
      const ownerRef = gameRef.collection("players").doc();

      const game: NewGame = {
        wordsPerPlayer,
        secondsPerTurn,
        owner: {
          id: ownerRef.id,
          name: ownerName,
          deviceId,
        },
        stage: "WAITING_FOR_PLAYERS",
        shortId: gameShortId,
        numberOfDevices: 1,
        payment: {
          paid: false,
        },
        maxNumberOfDevices: MAX_NUMBER_OF_DEVICES_FOR_UNPAID,
        devices: {
          [deviceId]: true,
        },
      };

      // Create Game
      batch.set(gameRef, game);

      // Create owner as a player
      batch.set(ownerRef, {
        name: ownerName,
        deviceId,
        createdAt: moment().unix(),
      });

      await batch.commit();
      setGameId(gameRef.id);
    } catch (e) {
      console.log("Error:StartGame:createGame", e);
      setError(e);
    }
  };

  const handleSubmit = (values: FormValues) => {
    createGame(values);
  };
  const classes = useStyles();

  if (gameId) {
    return <Redirect to={`/games/${gameId}`} />;
  }

  return (
    <ViewWrapper>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        position="relative"
      >
        <Box flex={4} className={classes.leftBox}>
          <H1>Créer une partie</H1>
          <LighterBox maxWidth={400} mt={3}>
            <Formik
              validateOnMount={true}
              initialValues={{
                ownerName: "",
                wordsPerPlayer: 5,
                secondsPerTurn: 45,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isValid }) => (
                <Form>
                  <TextInput
                    fullWidth
                    id="owner-name"
                    name="ownerName"
                    label="Nom du créateur.trice"
                  />
                  <Select
                    fullWidth
                    label="Nombre de boulettes par joueur.euse"
                    name="wordsPerPlayer"
                    options={[
                      { label: "3", value: 3 },
                      { label: "4", value: 4 },
                      { label: "5", value: 5 },
                      { label: "6", value: 6 },
                      { label: "7", value: 7 },
                      { label: "8", value: 8 },
                      { label: "9", value: 9 },
                      { label: "10", value: 10 },
                    ]}
                  />
                  <Select
                    fullWidth
                    label="Temps par tour"
                    name="secondsPerTurn"
                    options={[
                      { label: "10", value: 10 },
                      { label: "30", value: 30 },
                      { label: "45", value: 45 },
                      { label: "60", value: 60 },
                      { label: "75", value: 70 },
                      { label: "90", value: 90 },
                    ]}
                  />
                  <ButtonsGroup>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!isValid}
                      color="primary"
                    >
                      Continuer à créer votre partie
                    </Button>
                  </ButtonsGroup>
                </Form>
              )}
            </Formik>
          </LighterBox>
        </Box>
        <Box className={classes.rightBox}>
          <Box
            display="flex"
            justifyContent="center"
            className={classes.imageWrapper}
          >
            <Box maxWidth="350px">
              <Box>
                <img
                  width="100%"
                  src={iss}
                  alt="Drawing of the international space station"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ViewWrapper>
  );
};

export default StartGame;
