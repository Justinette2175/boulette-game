import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { Store } from "../../types";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import DeviceIdContext from "../../contexts/DeviceIdContext";
import GameContext from "../../contexts/GameContext";
import { FirebaseContext } from "../../firebase";

import TextInput from "../../components/TextInput";
import { Box, Typography, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ButtonsGroup from "../../components/ButtonsGroup";

import COPY from "../../copy";
import { useAddPlayer } from "../../hooks";

interface FormValues {
  name: string;
}

interface IProps {}

const JoinGame: React.FC<IProps> = () => {
  const [error, setError] = useState<Error>(null);
  const addPlayer = useAddPlayer();
  const language = "EN";
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: FormValues) => {
    await addPlayer(values.name);
  };

  return (
    <Box mt={4} display="flex" justifyContent="center">
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
                disabled={!isValid}
                color="secondary"
              >
                {COPY.JOIN_GAME_BUTTON[language]}
              </Button>
            </ButtonsGroup>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default JoinGame;
