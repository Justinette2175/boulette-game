import React from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase";
import "firebase/firestore";

import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Store, User, Word } from "../../types";
import { WORDS_PER_PLAYER } from "../../constants";
import Firebase from "../../services/firebase";

import { getUserWords } from "../../utils";

interface IProps {
  user: User;
  afterSubmit?: () => void;
}

const WordsSelector: React.FC<IProps> = ({ user, afterSubmit }) => {
  const gameId = useSelector((state: Store) => state.game.id);
  const gameWords = useSelector((state: Store) => state.game.words);
  const wordsToFill: number =
    WORDS_PER_PLAYER - getUserWords(gameWords, user).length;

  const validationSchema = Yup.object().shape({
    words: Yup.array().of(Yup.string()).max(WORDS_PER_PLAYER),
  });

  const handleSubmit = async (values: { words: Array<string> }) => {
    const formattedWords: Array<Word> = values.words.map((w) => ({
      text: w,
      writtenBy: user.name,
    }));
    try {
      afterSubmit();
      await Firebase.updateData("games", gameId, {
        words: firebase.firestore.FieldValue.arrayUnion(...formattedWords),
      });
    } catch (e) {
      console.log("Could not add words");
    }
  };

  return (
    <>
      <h2>Words selector for {user.name}</h2>
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
              render={(arrayHelpers) => (
                <>
                  {Array.apply(null, Array(wordsToFill)).map((_, i) => (
                    <Field key={`words.${i}`} name={`words.${i}`} />
                  ))}
                  <button type="submit" disabled={!isValid}>
                    Submit
                  </button>
                </>
              )}
            />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default WordsSelector;
