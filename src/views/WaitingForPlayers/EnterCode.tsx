import React, { useState, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Gift } from "react-feather";

import { Typography, Box, Button, useTheme } from "@material-ui/core";

import { useUseCode } from "../../hooks";
import TextInput from "../../components/TextInput";
import GameContext from "../../contexts/GameContext";
import { Modal } from "../../components/Containers";

interface IProps {
  open: boolean;
  onClose: () => void;
  code?: string;
}

const EnterCode: React.FC<IProps> = ({ open, onClose, code }) => {
  const [submitCode, loading, error] = useUseCode();

  const validationSchema = Yup.object().shape({
    code: Yup.string().required("Required"),
  });

  const handleSubmit = async ({ code }: { code: string }) => {
    try {
      await submitCode(code);
      onClose();
    } catch (e) {
      console.log("Error: e");
    }
  };

  const theme = useTheme();

  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="h2" style={{ maxWidth: "400px" }}>
        {code
          ? "Thanks for your puchase. Do you want to use your code for this game?"
          : "More than 3 devices in your game? Unlock it with a code."}
      </Typography>
      <Box display="flex" flexDirection="column">
        <Formik
          validateOnMount={true}
          initialValues={{
            code: code || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form>
              {error && <Typography color="error">{error.message}</Typography>}
              <Box mb={3}>
                <TextInput fullWidth name="code" label="Your code" />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isValid || loading}
                style={{ width: "100%" }}
              >
                Use Code
              </Button>
            </Form>
          )}
        </Formik>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<Gift size={20} />}
          component={Link}
          to="/buycode"
          style={{ marginTop: theme.spacing(1) }}
        >
          Acheter un code
        </Button>
      </Box>
    </Modal>
  );
};

export default EnterCode;
