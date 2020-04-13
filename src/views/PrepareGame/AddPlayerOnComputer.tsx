import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { addPlayerOnComputer } from "../../redux/game";
import { Button, Typography, Box, Paper } from "@material-ui/core";
import TextInput from "../../components/TextInput";
import ButtonsGroup from "../../components/ButtonsGroup";

const AddPlayerOnComputer: React.FC = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = (values: { name: string }) => {
    dispatch(addPlayerOnComputer(values.name));
  };

  return (
    <Box py={4} maxWidth="500px">
      <Paper elevation={0}>
        <Box p={2}>
          <Typography variant="h2">
            Add additional players on this device
          </Typography>
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
                <TextInput id="name" name="name" label="Player name" />
                <ButtonsGroup>
                  <Button
                    type="submit"
                    disabled={!isValid}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </ButtonsGroup>
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddPlayerOnComputer;
