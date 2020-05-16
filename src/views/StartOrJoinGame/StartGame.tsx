import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GameService from "../../services/game";
import { useSelector } from "react-redux";
import { Store } from "../../types";

import { Box, Button, Typography } from "@material-ui/core";
import TextInput from "../../components/TextInput";
import Select from "../../components/Select";
import ButtonsGroup from "../../components/ButtonsGroup";

import COPY from "../../copy";

const StartGame: React.FC = () => {
  const language = useSelector((state: Store) => state.computer.language);

  const validationSchema = Yup.object().shape({
    ownerName: Yup.string().required("Required"),
    wordsPerPlayer: Yup.number().required("Required"),
    secondsPerTurn: Yup.number().required("Required"),
  });

  const handleSubmit = (values: any) => {
    GameService.createGame(values);
  };

  return (
    <Box p={4}>
      <Typography variant="h2">{COPY.START_GAME_TITLE[language]}</Typography>
      <Typography variant="body1">{COPY.START_GAME_PARA[language]}</Typography>
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
  );
};

export default StartGame;
