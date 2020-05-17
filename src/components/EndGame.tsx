import React, { useState } from "react";

import { Button, Dialog, Box, Typography } from "@material-ui/core";
import { LogOut, X } from "react-feather";

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
    onClose();
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
            variant="outlined"
            onClick={onClose}
            style={{ marginRight: "16px" }}
            startIcon={<X size={14} />}
          >
            {COPY.END_GAME_MODAL_CLOSE[language]}
          </Button>
          <Button
            size="small"
            onClick={handleEndGame}
            color="primary"
            variant="contained"
            autoFocus
            startIcon={<LogOut size={14} />}
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

  return (
    <>
      <Button
        size="small"
        color="primary"
        onClick={() => setModalOpen(true)}
        startIcon={<LogOut size={14} />}
      >
        {COPY.END_GAME_BUTTON[language]}
      </Button>
      <EndGameModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      ></EndGameModal>
    </>
  );
};

export default EndGame;
