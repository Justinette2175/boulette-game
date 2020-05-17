import React from "react";
import { Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Store } from "../types";
import { updateLanguage } from "../redux/computer";

import { Settings } from "react-feather";

const SettingsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: Store) => state.computer.language);

  const toggleLanguage = () => {
    if (language === "EN") {
      dispatch(updateLanguage("FR"));
    } else if (language === "FR") {
      dispatch(updateLanguage("EN"));
    }
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
