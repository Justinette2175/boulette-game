import React, { useContext } from "react";

import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";

import { Dialog, Box, Button, Typography } from "@material-ui/core";
import TextInput from "../../components/TextInput";

import { getUserWords } from "../../utils";
import useGameWords from "../../hooks/useGameWords";
import GameContext from "../../contexts/GameContext";
import { FirebasePlayer, NewWord } from "../../types/firebaseTypes";
import useGameRef from "../../hooks/useGameRef";
import FirebaseContext from "../../firebase/FirebaseContext";
import { Modal } from "../../components/Containers";

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
      const batch = firebase.firestore().batch();
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
      console.log("Error:WordsSelector:handleSubmit", e);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Modal onClose={onClose} open={open}>
      <Typography variant="h2">{user.name}, entrez vos boulettes</Typography>
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
    </Modal>
  );
};

export default WordsSelector;
