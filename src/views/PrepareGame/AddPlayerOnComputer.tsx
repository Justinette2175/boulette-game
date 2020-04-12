import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { addPlayerOnComputer } from "../../redux/game";
import { Button, Typography } from "@material-ui/core";
import TextInput from "../../components/TextInput";

const AddPlayerOnComputer: React.FC = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = (values: { name: string }) => {
    dispatch(addPlayerOnComputer(values.name));
  };

  return (
    <>
      <Typography variant="h3">
        Add additional players on this device
      </Typography>
      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid }) => (
          <Form>
            <TextInput id="name" name="name" label="New player name" />
            <Button type="submit" disabled={!isValid}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddPlayerOnComputer;
