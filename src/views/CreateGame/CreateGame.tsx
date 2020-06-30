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

  if (gameId) {
    return <Redirect to={`/games/${gameId}`} />;
  }

  return (
    <Box pt={8} display="flex" justifyContent="center">
      <Box width="100%" maxWidth="500px">
        <Typography variant="h2">{COPY.START_GAME_TITLE[language]}</Typography>
        <Typography variant="body1">
          {COPY.START_GAME_PARA[language]}
        </Typography>
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
                label={COPY.PLAYER_NAME_LABEL[language]}
              />
              <Select
                fullWidth
                label={COPY.WORDS_PER_PLAYER_LABEL[language]}
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
                label={COPY.SECONDS_PER_TURN_LABEL[language]}
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
                  {COPY.START_GAME_BUTTON[language]}
                </Button>
              </ButtonsGroup>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default StartGame;
