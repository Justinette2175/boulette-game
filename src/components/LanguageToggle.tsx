import React from "react";
import { Button } from "@material-ui/core";

import { Settings } from "react-feather";

const SettingsContainer: React.FC = () => {
  const language = "EN";

  const toggleLanguage = () => {
    //
  };

  return (
    <Button
      size="small"
      color="primary"
      onClick={toggleLanguage}
      startIcon={<Settings size={14} />}
    >
      {language}
    </Button>
  );
};

export default SettingsContainer;
