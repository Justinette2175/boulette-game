import React, { useContext } from "react";
import { Typography, Box, Button } from "@material-ui/core";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import roundInstructionsCopy from "../../copy/roundInstructions";
import { Modal } from "../../components/Containers";

import Describe from "../../assets/images/describe.png";
import OneWord from "../../assets/images/one-word.png";
import Mime from "../../assets/images/mime.png";
import Sounds from "../../assets/images/sounds.png";
import FacialExpressions from "../../assets/images/facial-expressions.png";

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
  const getImageSource = () => {
    switch (roundId) {
      case "1":
        return Describe;
      case "2":
        return OneWord;
      case "3":
        return Mime;
      case "4":
        return Sounds;
      case "5":
        return FacialExpressions;
    }
  };
  return (
    <Modal disableBackdropClick open={open} onClose={onClose}>
      <Box display="flex" flexDirection="column">
        <Typography variant="body1">Round {roundId} </Typography>
        <Typography variant="h2">{roundInstructions.title}</Typography>
        <Box
          display="flex"
          flexDirection="row-reverse"
          justifyContent="center"
          flexWrap="wrap"
        >
          <Box display="flex" justifyContent="center" mb={3}>
            <Box maxWidth="300px">
              <img src={getImageSource()} width="100%" />
            </Box>
          </Box>
          <Box mb={3}>
            {roundInstructions.paragraphs.map((p: string) => (
              <Typography gutterBottom variant="body1">
                {p}
              </Typography>
            ))}
          </Box>
        </Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Got it, let's go!
        </Button>
      </Box>
    </Modal>
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
