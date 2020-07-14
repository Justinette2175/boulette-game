import React, { useContext } from "react";
import { BookOpen } from "react-feather";
import { Box, Typography, Button, useTheme } from "@material-ui/core";
import CurrentRoundContext from "../contexts/CurrentRoundContext";
import { SidePaddingWrapper } from "./Containers";

import COPY from "../copy";

interface IProps {
  openInstructions: () => void;
}

const RoundAndInstructions: React.FC<IProps> = ({ openInstructions }) => {
  const round = useContext(CurrentRoundContext);
  const language = "EN";

  const theme = useTheme();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="secondary.dark"
    >
      <SidePaddingWrapper>
        <Box display="flex" alignItems="center" py={1}>
          <Box mr={2}>
            <Typography
              variant="h3"
              style={{
                marginBottom: 0,
                color: theme.palette.secondary.contrastText,
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
      </SidePaddingWrapper>
    </Box>
  );
};

export default RoundAndInstructions;
