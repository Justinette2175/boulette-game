import React, { useState } from "react";

import { Button, Dialog, Box, Typography, useTheme } from "@material-ui/core";

import GameService from "../services/game";

import { useSelector } from "react-redux";
import { Store } from "../types";

import COPY from "../copy";

interface EndGameModalProps {
  open: boolean;
  onClose: () => void;
}
const EndGameModal: React.FC<EndGameModalProps> = ({ open, onClose }) => {
  const language = useSelector((state: Store) => state.computer.language);

  const handleEndGame = () => {
    GameService.terminateGame();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box p={6}>
        <Typography variant="h2">
          {COPY.END_GAME_MODAL_SURE[language]}
        </Typography>
        <Typography variant="body1">
          {COPY.END_GAME_MODAL_EXPLANATION[language]}
        </Typography>
        <Box display="flex" mt={4} justifyContent="flex-end">
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={onClose}
            style={{ marginRight: "16px" }}
          >
            {COPY.END_GAME_MODAL_CLOSE[language]}
          </Button>
          <Button
            size="small"
            onClick={handleEndGame}
            color="primary"
            autoFocus
          >
            {COPY.END_GAME_MODAL_CONFIRM[language]}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

const EndGame: React.FC = () => {
  const language = useSelector((state: Store) => state.computer.language);
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  return (
    <Box
      position="fixed"
      bottom={theme.spacing(2)}
      right={theme.spacing(2)}
      zIndex={100}
    >
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => setModalOpen(true)}
      >
        {COPY.END_GAME_BUTTON[language]}
      </Button>
      <EndGameModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      ></EndGameModal>
    </Box>
  );
};

export default EndGame;
