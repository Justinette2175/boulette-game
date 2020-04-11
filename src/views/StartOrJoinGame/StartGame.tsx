import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { createGame } from "../../redux/game";

import { Box, Button, Typography } from "@material-ui/core";
import TextInput from "../../components/TextInput";

const StartGame: React.FC = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    ownerName: Yup.string().required("Required"),
  });

  const handleSubmit = (values: any) => {
    dispatch(createGame(values.ownerName));
  };

  return (
    <>
      <Typography variant="h4">Start a new game</Typography>
      <Typography variant="body1">You'll be able to invite players.</Typography>
      <Formik
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
            <Button type="submit" variant="contained" disabled={!isValid}>
              Create Game
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default StartGame;
