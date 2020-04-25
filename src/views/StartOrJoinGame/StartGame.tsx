import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GameService from "../../services/game";

import { Box, Button, Typography } from "@material-ui/core";
import TextInput from "../../components/TextInput";
import ButtonsGroup from "../../components/ButtonsGroup";
import WordOnPaper from "../../components/WordOnPaper";

const StartGame: React.FC = () => {
  const validationSchema = Yup.object().shape({
    ownerName: Yup.string().required("Required"),
  });

  const handleSubmit = (values: any) => {
    GameService.createGame(values.ownerName);
  };

  return (
    <Box p={4}>
      <Typography variant="h2">Start a new game</Typography>
      <Typography variant="body1">You'll be able to invite players.</Typography>
      <Formik
        validateOnMount={true}
        initialValues={{
          ownerName: "",
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
                  id="owner-name"
                  name="ownerName"
                  label="Player name"
                />
              </Box>
            </Box>
            <ButtonsGroup>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid}
                color="secondary"
              >
                Create Game
              </Button>
            </ButtonsGroup>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default StartGame;
