import React, { useState, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import TextInput from "../../components/TextInput";
import { Box, Typography, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ButtonsGroup from "../../components/ButtonsGroup";

import COPY from "../../copy";
import { useAddPlayer } from "../../hooks";
import GameContext from "../../contexts/GameContext";
import { ViewWrapper } from "../../components/Containers";

interface FormValues {
  name: string;
}

interface IProps {}

const JoinGame: React.FC<IProps> = () => {
  const game = useContext(GameContext);
  const [addPlayer, loading, error] = useAddPlayer({ sameDevice: false });
  const language = "EN";
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: FormValues) => {
    await addPlayer(values.name);
  };

  if (game?.stage !== "WAITING_FOR_PLAYERS") {
    return <Box>It's too late to join this game, it has already started.</Box>;
  }

  if (game?.numberOfDevices >= game?.maxNumberOfDevices) {
    return (
      <Box>
        Cannot join this game because there already are too many players...
      </Box>
    );
  }

  return (
    <ViewWrapper>
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      )}
      <Typography variant="h2">{COPY.JOIN_GAME_TITLE[language]}</Typography>
      <Formik
        validateOnMount={true}
        initialValues={{
          name: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid }) => (
          <Form>
            <TextInput
              fullWidth
              id="player-name"
              name="name"
              label={COPY.PLAYER_NAME_LABEL[language]}
            />
            <ButtonsGroup>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || loading}
                color="secondary"
              >
                {COPY.JOIN_GAME_BUTTON[language]}
              </Button>
            </ButtonsGroup>
          </Form>
        )}
      </Formik>
    </ViewWrapper>
  );
};

export default JoinGame;
