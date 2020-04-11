import React from "react";
import { useSelector } from "react-redux";
import { Store, Username } from "../../types";

const Words: React.FC = () => {
  const words = useSelector((state: Store) => state.game.words);

  return (
    <div>
      <h2>Words in the game :</h2>
      {words.map((w) => (
        <ul>
          <li>{w.text}</li>
        </ul>
      ))}
    </div>
  );
};

export default Words;
