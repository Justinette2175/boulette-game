import React from "react";
import { Box, useTheme, useMediaQuery } from "@material-ui/core";
import { useSelector } from "react-redux";
import { Theme } from "@material-ui/core/styles";

import { Store } from "../types";
import LanguageToggle from "./LanguageToggle";
import EndGame from "./EndGame";

const SettingsContainer: React.FC = () => {
  const theme = useTheme();
  const gameId = useSelector((state: Store) => state.game.id);
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  return (
    <Box
      position="fixed"
      bottom={theme.spacing(2)}
      right={theme.spacing(2)}
      zIndex={100}
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      <Box mb={0.5}>
        <LanguageToggle />
      </Box>
      <Box>{gameId && !isSmallScreen && <EndGame />}</Box>
    </Box>
  );
};

export default SettingsContainer;
