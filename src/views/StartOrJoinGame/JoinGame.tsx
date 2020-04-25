import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GameService from "../../services/game";

import TextInput from "../../components/TextInput";
import { Box, Typography, Button } from "@material-ui/core";
import ButtonsGroup from "../../components/ButtonsGroup";

const JoinGame: React.FC = () => {
  const validationSchema = Yup.object().shape({
    playerName: Yup.string().required("Required"),
    gameId: Yup.string().required("Required"),
  });

  const handleSubmit = (values: any) => {
    GameService.joinGame(values.playerName, values.gameId);
  };

  return (
    <Box p={4}>
      <Typography variant="h2">Join an existing game</Typography>
      <Typography variant="body1">
        If one of your friends has already created a game, ask for their game
        number and join them.
      </Typography>
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
            <Box display="flex">
              <Box mr={1}>
                <TextInput
                  fullWidth
                  id="game-id"
                  name="gameId"
                  label="Game ID"
                />
              </Box>
              <Box ml={1}>
                <TextInput
                  fullWidth
                  id="player-name"
                  name="playerName"
                  label="Player name"
                />
              </Box>
            </Box>
            <ButtonsGroup>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid}
                color="primary"
              >
                Join Game
              </Button>
            </ButtonsGroup>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default JoinGame;
