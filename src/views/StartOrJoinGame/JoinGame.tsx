import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { joinGame } from "../../redux/game";

import TextInput from "../../components/TextInput";
import { Box, Typography, Button } from "@material-ui/core";

const JoinGame: React.FC = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    playerName: Yup.string().required("Required"),
    gameId: Yup.string().required("Required"),
  });

  const handleSubmit = (values: any) => {
    dispatch(joinGame(values.playerName, values.gameId));
  };

  return (
    <>
      <Typography variant="h4">Join an existing game</Typography>
      <Typography variant="body1">
        If one of your friends has already created a game, ask for their game
        number and join them.
      </Typography>
      <Formik
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
            <Button type="submit" variant="contained" disabled={!isValid}>
              Join Game
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default JoinGame;
