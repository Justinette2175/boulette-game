import React from "react";
import { StaggeredMotion, spring, presets } from "react-motion";
import JoinGame from "./JoinGame";
import StartGame from "./StartGame";
import { Box, Paper } from "@material-ui/core";
import Background from "../../components/Background";

const StartOrJoinGame: React.FC = () => {
  return (
    <>
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        <StaggeredMotion
          defaultStyles={[{ h: -200 }, { h: -200 }]}
          styles={(prevInterpolatedStyles) =>
            prevInterpolatedStyles.map((_, i) => {
              return i === 0
                ? { h: spring(0, presets.stiff) }
                : {
                    h: spring(prevInterpolatedStyles[i - 1].h, presets.stiff),
                  };
            })
          }
        >
          {(val: any) => (
            <>
              <Box
                position="relative"
                width="500px"
                mr={4}
                style={{ transform: `translateY(${val[0].h}px)` }}
              >
                <Paper elevation={0}>
                  <JoinGame />
                </Paper>
              </Box>
              <Box
                position="relative"
                width="500px"
                ml={4}
                style={{ transform: `translateY(${val[1].h}px)` }}
              >
                <Paper elevation={0}>
                  <StartGame />
                </Paper>
              </Box>
            </>
          )}
        </StaggeredMotion>
      </Box>
    </>
  );
};

export default StartOrJoinGame;
