import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import useCurrentPlayerIsOnDevice from "../utils/useCurrentPlayerIsOnDevice";
import { Store } from "../types";
import { useSelector } from "react-redux";

import Jitsy from "../services/jisty";

const JitsyNew: React.FC = () => {
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();
  const gameId = useSelector((state: Store) => state.game.id);
  let j;
  useEffect(() => {
    j = new Jitsy(gameId);
  }, []);

  return <Box id="video" />;
};

export default JitsyNew;
