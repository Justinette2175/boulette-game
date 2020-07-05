import React, { useContext } from "react";
import { BookOpen } from "react-feather";
import { Box, Typography, Button, useTheme } from "@material-ui/core";
import CurrentRoundContext from "../contexts/CurrentRoundContext";

import COPY from "../copy";

interface IProps {
  openInstructions: () => void;
  callsDisplayed: boolean;
  setCallsDisplayed: (newState: any) => void;
}

const RoundAndInstructions: React.FC<IProps> = ({
  openInstructions,
  callsDisplayed,
  setCallsDisplayed,
}) => {
  const round = useContext(CurrentRoundContext);
  const language = "EN";

  const theme = useTheme();

  return (
    <Box width="100%" bgcolor="secondary.light">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="secondary.dark"
        px={2}
        py={1}
      >
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Typography
              variant="body1"
              style={{
                marginBottom: 0,
                color: theme.palette.secondary.contrastText,
                fontWeight: 500,
              }}
            >
              {COPY.ROUND[language]} {round?.id}
            </Typography>
          </Box>
          <Button
            onClick={openInstructions}
            size="small"
            variant="contained"
            color="primary"
            startIcon={<BookOpen size={14} />}
          >
            {COPY.READ_INSTRUCTIONS_BUTTON[language]}
          </Button>
        </Box>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => setCallsDisplayed((prev: boolean) => !prev)}
        >
          {callsDisplayed ? "Hide videos" : "Show videos"}
        </Button>
      </Box>
    </Box>
  );
};

export default RoundAndInstructions;
