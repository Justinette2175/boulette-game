import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Store } from "../../types";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import TextInput from "../../components/TextInput";
import { Box, Typography, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ButtonsGroup from "../../components/ButtonsGroup";

import COPY from "../../copy";

interface IProps {}

const JoinGame: React.FC<IProps> = () => {
  const [error, setError] = useState<Error>(null);
  const language = "EN";
  const validationSchema = Yup.object().shape({
    playerName: Yup.string().required("Required"),
    gameId: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: any) => {};

  return (
    <>
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      )}
      <Typography variant="h2">{COPY.JOIN_GAME_TITLE[language]}</Typography>
      <Typography variant="body1">{COPY.JOIN_GAME_PARA[language]}</Typography>
      <Formik
        validateOnMount={true}
        initialValues={{
          playerName: "",
          gameId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid }) => (
          <Form>
            <TextInput
              fullWidth
              id="game-id"
              name="gameId"
              label={COPY.GAME_ID_LABEL[language]}
            />
            <TextInput
              fullWidth
              id="player-name"
              name="playerName"
              label={COPY.PLAYER_NAME_LABEL[language]}
            />
            <ButtonsGroup>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid}
                color="secondary"
              >
                {COPY.JOIN_GAME_BUTTON[language]}
              </Button>
            </ButtonsGroup>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default JoinGame;
