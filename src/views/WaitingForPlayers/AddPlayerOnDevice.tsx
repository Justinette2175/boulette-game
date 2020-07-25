import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button, Typography, Box } from "@material-ui/core";
import TextInput from "../../components/TextInput";
import useAddPlayer from "../../hooks/useAddPlayer";
import { Modal } from "../../components/Containers";
import { Loader } from "../../components/Loading";
import Error from "../../components/Error";

interface IProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
}

const AddPlayerOnDevice: React.FC<IProps> = ({ open, onClose }) => {
  const [addPlayer, loading, error] = useAddPlayer(
    { sameDevice: true },
    onClose
  );

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: FormValues) => {
    await addPlayer(values.name);
  };

  return (
    <Modal onClose={onClose} open={open}>
      <Typography variant="h2">
        Ajouter un.e joueur.euse sur cet appareil
      </Typography>
      {loading ? (
        <Loader />
      ) : (
        <>
          {error && <Error error={error} />}

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
                <Box display="flex" flexDirection="column">
                  <TextInput
                    id="name"
                    name="name"
                    fullWidth
                    placeholder="Nom du joueur.euse"
                  />
                  <Button
                    type="submit"
                    disabled={!isValid || loading}
                    variant="contained"
                    color="primary"
                  >
                    Ajouter
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </>
      )}
    </Modal>
  );
};

export default AddPlayerOnDevice;
