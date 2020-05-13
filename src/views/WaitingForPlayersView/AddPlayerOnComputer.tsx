import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GameService from "../../services/game";
import { useSelector } from "react-redux";
import { Store } from "../../types";

import COPY from "../../copy";

import { Button, Typography, Box, Dialog } from "@material-ui/core";
import TextInput from "../../components/TextInput";
import ButtonsGroup from "../../components/ButtonsGroup";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const AddPlayerOnComputer: React.FC<IProps> = ({ open, onClose }) => {
  const language = useSelector((state: Store) => state.computer.language);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = (values: { name: string }) => {
    onClose();
    GameService.addPlayerOnDevice(values.name);
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

export default AddPlayerOnComputer;
