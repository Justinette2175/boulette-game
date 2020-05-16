import React from "react";
import { TransitionMotion, spring } from "react-motion";
import { Box } from "@material-ui/core";
import { uuid } from "uuidv4";

interface IProps {
  children: React.ReactNode;
}

const WordTransitionWrapper: React.FC<IProps> = ({ children }) => {
  const wrapperId = uuid();
  return (
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
          key: wrapperId,
        },
      ]}
      defaultStyles={[
        {
          style: { top: 0, opacity: 1 },
          key: wrapperId,
        },
      ]}
    >
      {(interpolatedStyles) => (
        <>
          {interpolatedStyles.map((s) => {
            return (
              <Box position="relative" key={s.key}>
                {children}
              </Box>
            );
          })}
        </>
      )}
    </TransitionMotion>
  );
};

export default WordTransitionWrapper;
