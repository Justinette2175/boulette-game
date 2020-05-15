import React from "react";
import { useSelector } from "react-redux";

import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Store, User, Word } from "../../types";
import Firebase from "../../services/firebase";

import {
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
} from "@material-ui/core";
import TextInput from "../../components/TextInput";

import { getUserWords } from "../../utils";

const db = Firebase.db;

interface IProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

const WordsSelector: React.FC<IProps> = ({ user, open, onClose }) => {
  const gameId = useSelector((state: Store) => state.game.id);
  const gameWords = useSelector((state: Store) => state.game.words);
  const wordsPerPlayer = useSelector(
    (state: Store) => state.game.wordsPerPlayer
  );
  const wordsToFill: number =
    wordsPerPlayer - getUserWords(gameWords, user).length;

  const validationSchema = Yup.object().shape({
    words: Yup.array().of(Yup.string()).max(wordsPerPlayer),
  });

  const handleSubmit = async (values: { words: Array<string> }) => {
    onClose();
    console.log("waords are", values);
    try {
      let batch = db.batch();
      const wordsRef = db.collection("games").doc(gameId).collection("words");
      values.words.forEach((w: any) => {
        if (w) {
          const wordRef = wordsRef.doc();
          batch.set(wordRef, { text: w, writtenBy: user.id });
        }
      });
      await batch.commit();
    } catch (e) {
      console.log("Could not add words", e);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth="md"
      PaperProps={{ elevation: 0 }}
    >
      <Box p={6}>
        <Typography variant="h2">Selecting words for {user.name}</Typography>
        <Typography variant="body1">
          Type the words you want to add to the bowl. You have {wordsToFill}{" "}
          words left.
        </Typography>
        <Formik
          validateOnMount={true}
          initialValues={{
            words: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form>
              <FieldArray
                name="words"
                render={() => (
                  <Box>
                    {Array.apply(null, Array(wordsToFill)).map((_, i) => (
                      <Box>
                        <TextInput
                          key={`words.${i}`}
                          name={`words.${i}`}
                          fullWidth
                        />
                      </Box>
                    ))}
                    <Box mt={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isValid}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                )}
              />
            </Form>
          )}
        </Formik>
      </Box>
    </Dialog>
  );
};

export default WordsSelector;
