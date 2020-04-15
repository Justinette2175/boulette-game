import React from "react";
import { TransitionMotion, spring } from "react-motion";
import { Word } from "../types";
import WordOnPaper from "../components/WordOnPaper";
import { Button, Box } from "@material-ui/core";

interface IProps {
  currentWord: Word;
}

const WordTransitionWrapper: React.FC<IProps> = ({ currentWord }) => {
  return (
    <Box position="relative" width="350px" height="200px">
      <TransitionMotion
        willLeave={() => ({
          top: spring(-200),
          opacity: spring(0),
        })}
        willEnter={() => ({
          top: 200,
          opacity: 0,
        })}
        styles={[
          {
            style: { top: spring(0), opacity: spring(1) },
            key: currentWord.text + currentWord.writtenBy,
          },
        ]}
        defaultStyles={[
          {
            style: { top: 0, opacity: 1 },
            key: currentWord.text + currentWord.writtenBy,
          },
        ]}
      >
        {(interpolatedStyles) => (
          <>
            {interpolatedStyles.map((s) => (
              <Box
                mb={4}
                key={s.key}
                position="absolute"
                style={{
                  transform: `translateY(${s.style.top}px)`,
                  opacity: s.style.opacity,
                }}
              >
                <WordOnPaper word={currentWord.text} />
              </Box>
            ))}
          </>
        )}
      </TransitionMotion>
    </Box>
  );
};

export default WordTransitionWrapper;
