import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
} from "@material-ui/core";
import { Store } from "../../types";
import useCurrentRoundIndex from "../../utils/useCurrentRoundIndex";
import roundInstructionsCopy from "../../utils/copy/roundInstructions";
import { updateInstructionsVisibility } from "../../redux/computer";

const instructions = roundInstructionsCopy as any;

interface RoundInstructionsModalProps {
  open: boolean;
  onClose: () => void;
  round: number;
}
const RoundInstructionsModal: React.FC<RoundInstructionsModalProps> = ({
  open,
  onClose,
  round,
}) => {
  const roundInstructions = instructions[round.toString()].EN;
  return (
    <Dialog disableBackdropClick open={open} onClose={onClose}>
      <Box p={4}>
        <DialogTitle>Round {round} </DialogTitle>
        <DialogContent>
          <Typography variant="h2">{roundInstructions.title}</Typography>
          {roundInstructions.paragraphs.map((p: string) => (
            <Typography gutterBottom variant="body1">
              {p}
            </Typography>
          ))}
          <Box mt={2}>
            <Typography variant="h3" component="p">
              Good Luck!
            </Typography>
          </Box>

          <Button color="primary" variant="contained" onClick={onClose}>
            Got it, let's go!
          </Button>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

const RoundInstructions: React.FC = () => {
  const instructionsVisible = useSelector(
    (state: Store) => state.computer.instructionsVisible
  );

  const currentRoundIndex = useCurrentRoundIndex();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateInstructionsVisibility(false));
  }, [currentRoundIndex]);

  if (!currentRoundIndex) {
    return null;
  }
  return (
    <RoundInstructionsModal
      open={instructionsVisible}
      round={currentRoundIndex}
      onClose={() => dispatch(updateInstructionsVisibility(false))}
    />
  );
};

export default RoundInstructions;
