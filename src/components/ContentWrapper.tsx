import React from "react";
import { StaggeredMotion, spring, presets } from "react-motion";
import { Box, Grid } from "@material-ui/core";

interface IProps {
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
}
const ContentWrapper: React.FC<IProps> = ({ leftChild, rightChild }) => {
  return (
    <>
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        position="relative"
        p={2}
      >
        <Grid container spacing={3} style={{ width: "100%" }}>
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
                <Grid item xs={12} md={6}>
                  <Box width="100%" display="flex" justifyContent="center">
                    <Box
                      position="relative"
                      maxWidth="500px"
                      width="100%"
                      style={{ transform: `translateY(${val[0].h}px)` }}
                    >
                      {leftChild}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box width="100%" display="flex" justifyContent="center">
                    <Box
                      position="relative"
                      maxWidth="500px"
                      width="100%"
                      style={{ transform: `translateY(${val[1].h}px)` }}
                    >
                      {rightChild}
                    </Box>
                  </Box>
                </Grid>
              </>
            )}
          </StaggeredMotion>
        </Grid>
      </Box>
    </>
  );
};

export default ContentWrapper;
