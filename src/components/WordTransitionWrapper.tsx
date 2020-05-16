import React from "react";
import { TransitionMotion, Motion, spring } from "react-motion";
import { Word } from "../types";
import WordOnPaper from "../components/WordOnPaper";
import { Box } from "@material-ui/core";

interface IProps {
  currentWord: Word;
}

const WordTransitionWrapper: React.FC<IProps> = ({ currentWord }) => {
  return (
    <Motion
      defaultStyle={{ top: 300, opacity: 0 }}
      style={{ top: spring(0), opacity: spring(1) }}
    >
      {(s) => (
        <Box
          position="relative"
          width="350px"
          height="200px"
          style={{
            transform: `translateY(${s.top}px)`,
            opacity: s.opacity,
          }}
        >
          <TransitionMotion
            willLeave={() => ({
              top: spring(-300),
              opacity: spring(0),
            })}
            willEnter={() => ({
              top: 300,
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
            {(interpolatedStyles) => {
              return (
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
              );
            }}
          </TransitionMotion>
        </Box>
      )}
    </Motion>
  );
};

export default WordTransitionWrapper;
