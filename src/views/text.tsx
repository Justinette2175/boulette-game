import React, { useState } from "react";
import { Box } from "@material-ui/core";
import CurrentPlayerViewInterface from "./PlayGame/CurrentPlayerViewInterface";

const WORDS = ["mommy", "pool", "love", "blitz"];

const Test: React.FC = () => {
  const [words, setWords] = useState([]);
  console.log("wrods are", words);
  return (
    <Box>
      <CurrentPlayerViewInterface
        currentWord={words.length > 0 ? words[0] : null}
        onFound={() => {
          const w = [...words];
          w.shift();
          console.log("w after shift", w);
          setWords(w);
        }}
        onStart={() => setWords(WORDS.map((w) => ({ text: w })))}
      />
    </Box>
  );
};

export default Test;
