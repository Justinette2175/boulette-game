import React, { useState } from "react";
import {
  Button,
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from "@material-ui/core";

interface EndGameModalProps {
  open: boolean;
  onClose: () => void;
}
const EndGameModal: React.FC<EndGameModalProps> = ({ open, onClose }) => {
  const handleLeaveGame = () => {
    console.log("handle leave");
  };

  const handleEndGame = () => {
    console.log("handle leave");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box p={2}>
        <DialogTitle>Are you sure you want to leave this game?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You can either leave this game but let others continue, or end the
            game entirely for all the players. Which one would you like to do?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={onClose}
          >
            Continue playing
          </Button>
          <Button size="small" onClick={handleLeaveGame} color="primary">
            Leave
          </Button>
          <Button
            size="small"
            onClick={handleEndGame}
            color="primary"
            autoFocus
          >
            End game for everyone
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const EndGame: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Box position="fixed" bottom="0" right="0" zIndex={100}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => setModalOpen(true)}
      >
        Leave game
      </Button>
      <EndGameModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      ></EndGameModal>
    </Box>
  );
};

export default EndGame;
