import React, { useContext } from "react";

import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

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
import useGameWords from "../../hooks/useGameWords";
import GameContext from "../../contexts/GameContext";
import { FirebasePlayer, NewWord } from "../../types/firebaseTypes";
import useGameRef from "../../hooks/useGameRef";
import FirebaseContext from "../../firebase/FirebaseContext";

interface IProps {
  user: FirebasePlayer;
  open: boolean;
  onClose: () => void;
}

const WordsSelector: React.FC<IProps> = ({ user, open, onClose }) => {
  const words = useGameWords();
  const gameRef = useGameRef();
  const firebase = useContext(FirebaseContext);
  const { wordsPerPlayer } = useContext(GameContext);
  const wordsToFill: number = wordsPerPlayer - getUserWords(words, user).length;

  const validationSchema = Yup.object().shape({
    words: Yup.array().of(Yup.string()).max(wordsPerPlayer),
  });

  const handleSubmit = async (values: { words: Array<string> }) => {
    try {
      let batch = firebase.firestore.batch();
      const wordsRef = gameRef.collection("words");
      values.words.forEach((w: any) => {
        const newWord: NewWord = {
          word: w,
          writtenBy: {
            id: user.id,
            name: user.name,
          },
        };
        if (w) {
          const wordRef = wordsRef.doc();
          batch.set(wordRef, newWord);
        }
      });
      await batch.commit();
      onClose();
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
