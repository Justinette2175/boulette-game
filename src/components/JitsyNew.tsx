import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import useCurrentPlayerIsOnDevice from "../utils/useCurrentPlayerIsOnDevice";
import { Store } from "../types";
import { useSelector } from "react-redux";

import Jitsy from "../services/jitsy";

const JitsyNew: React.FC = () => {
  const gameId = useSelector((state: Store) => state.game.id);
  let j;

  return <Box id="video" />;
};

export default JitsyNew;
