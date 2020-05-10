import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GameService from "../../services/game";

import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import TextInput from "../../components/TextInput";
import ButtonsGroup from "../../components/ButtonsGroup";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const AddPlayerOnComputer: React.FC<IProps> = ({ open, onClose }) => {
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
      <Box p={2}>
        <DialogTitle style={{ textAlign: "center" }}>
          Add additional players on this device
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1"></Typography>
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
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AddPlayerOnComputer;
