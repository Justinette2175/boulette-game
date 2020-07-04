import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import COPY from "../../copy";

import { Button, Typography, Box, Dialog } from "@material-ui/core";
import TextInput from "../../components/TextInput";
import ButtonsGroup from "../../components/ButtonsGroup";
import useAddPlayer from "../../hooks/useAddPlayer";

interface IProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
}

const AddPlayerOnDevice: React.FC<IProps> = ({ open, onClose }) => {
  const language = "EN";
  const addPlayer = useAddPlayer();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: FormValues) => {
    await addPlayer(values.name);
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth="md"
      PaperProps={{ elevation: 0 }}
    >
      <Box p={6}>
        <Typography variant="h2">
          {COPY.ADD_DEVICE_PLAYER_BUTTON[language]}
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
              <TextInput
                id="name"
                name="name"
                fullWidth
                label={COPY.PLAYER_NAME_LABEL[language]}
              />
              <ButtonsGroup>
                <Button
                  type="submit"
                  disabled={!isValid}
                  variant="contained"
                  color="primary"
                >
                  {COPY.SUBMIT[language]}
                </Button>
              </ButtonsGroup>
            </Form>
          )}
        </Formik>
      </Box>
    </Dialog>
  );
};

export default AddPlayerOnDevice;
