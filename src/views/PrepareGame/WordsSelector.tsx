import React from "react";
import { useSelector } from "react-redux";

import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Store, User, Word } from "../../types";
import { WORDS_PER_PLAYER } from "../../constants";
import Firebase from "../../services/firebase";

import {
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  Button,
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
  const wordsToFill: number =
    WORDS_PER_PLAYER - getUserWords(gameWords, user).length;

  const validationSchema = Yup.object().shape({
    words: Yup.array().of(Yup.string()).max(WORDS_PER_PLAYER),
  });

  const handleSubmit = async (values: { words: Array<string> }) => {
    onClose();
    try {
      let batch = db.batch();
      const wordsRef = db.collection("games").doc(gameId).collection("words");
      values.words.forEach((w: any) => {
        const wordRef = wordsRef.doc();
        batch.set(wordRef, { text: w, writtenBy: user.id });
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
      maxWidth="xl"
      PaperProps={{ elevation: 0 }}
    >
      <Box p={2}>
        <DialogTitle>Words selector for {user.name}</DialogTitle>
        <DialogContent>
          <h3>You have {wordsToFill} words left</h3>
          <Formik
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
                    <>
                      {Array.apply(null, Array(wordsToFill)).map((_, i) => (
                        <TextInput key={`words.${i}`} name={`words.${i}`} />
                      ))}
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid}
                      >
                        Submit
                      </Button>
                    </>
                  )}
                />
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default WordsSelector;
