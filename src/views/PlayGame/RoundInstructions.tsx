import React, { useState, useEffect, useContext } from "react";
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
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import useCurrentRoundIndex from "../../utils/useCurrentRoundIndex";
import roundInstructionsCopy from "../../copy/roundInstructions";
import { updateInstructionsVisibility } from "../../redux/computer";

const instructions = roundInstructionsCopy as any;

interface RoundInstructionsModalProps {
  open: boolean;
  onClose: () => void;
  roundId: string;
}
const RoundInstructionsModal: React.FC<RoundInstructionsModalProps> = ({
  open,
  onClose,
  roundId,
}) => {
  const roundInstructions = instructions[roundId].EN;
  return (
    <Dialog disableBackdropClick open={open} onClose={onClose}>
      <Box p={6}>
        <Typography variant="body1">Round {roundId} </Typography>
        <Typography variant="h2">{roundInstructions.title}</Typography>
        {roundInstructions.paragraphs.map((p: string) => (
          <Typography gutterBottom variant="body1">
            {p}
          </Typography>
        ))}
        <Box mt={2}>
          <Typography variant="h2" component="p">
            Good Luck!
          </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button color="primary" variant="contained" onClick={onClose}>
            Got it, let's go!
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

interface IProps {
  open: boolean;
  onClose: () => void;
}

const RoundInstructions: React.FC<IProps> = ({ open, onClose }) => {
  const currentRound = useContext(CurrentRoundContext);
  if (!currentRound) {
    return null;
  }
  return (
    <RoundInstructionsModal
      open={open}
      roundId={currentRound.id}
      onClose={onClose}
    />
  );
};

export default RoundInstructions;
