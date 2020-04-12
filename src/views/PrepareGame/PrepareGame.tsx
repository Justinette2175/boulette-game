import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Store, User } from "../../types";
import AddPlayerOnComputer from "./AddPlayerOnComputer";
import { startGame } from "../../redux/game";
import WordsSelector from "./WordsSelector";

import GameInfo from "./GameInfo";
import TeamsSelector from "./TeamsSelector";
import { Button } from "@material-ui/core";

const PrepareGame: React.FC = () => {
  const dispatch = useDispatch();
  const game = useSelector((state: Store) => state.game);
  const computerUsers = useSelector((state: Store) => state.computer.users);
  const ownerIsOnComputer = computerUsers.indexOf(game.owner) > -1;

  const [wordsModalUser, setWordsModalUser] = useState<User>(null);

  const handleStartGame = () => {
    dispatch(startGame());
  };

  const handleOpenAddWords = (user: User) => {
    setWordsModalUser(user);
  };

  const closeAddWords = () => setWordsModalUser(null);

  return (
    <div>
      <GameInfo />
      <TeamsSelector onOpenAddWords={handleOpenAddWords} />
      <WordsSelector
        user={wordsModalUser}
        onClose={closeAddWords}
        open={!!wordsModalUser}
      />
      <AddPlayerOnComputer />
      {ownerIsOnComputer && (
        <Button onClick={handleStartGame}>Start the game!</Button>
      )}
    </div>
  );
};

export default PrepareGame;
