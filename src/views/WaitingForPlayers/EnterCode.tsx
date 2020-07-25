import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Gift } from "react-feather";

import { Typography, Box, Button, useTheme } from "@material-ui/core";

import { useUseCode } from "../../hooks";
import TextInput from "../../components/TextInput";
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
          ? "Bravo! Vous recevrez votre code par couriel. Souhaitez-vous l'utiliser maintenant?"
          : "Entrez votre code pour jouer à plus de 3 appareils."}
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
                <TextInput fullWidth placeholder="Entrez un code" name="code" />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isValid || loading}
                style={{ width: "100%" }}
              >
                Appliquer le code
              </Button>
            </Form>
          )}
        </Formik>
        {!code && (
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
        )}
      </Box>
    </Modal>
  );
};

export default EnterCode;
