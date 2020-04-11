import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Store, Username, User } from "../../types";
import AddPlayerOnComputer from "./AddPlayerOnComputer";
import { startGame } from "../../redux/game";
import WordsSelector from "./WordsSelector";
import Words from "./Words";

import { userStillHasWordsToWrite } from "../../utils";
import GameInfo from "./GameInfo";
import TeamsSelector from "./TeamsSelector";

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
      {game.teams.map((t) => (
        <p>{t.name}</p>
      ))}
      <h2>Users</h2>
      <TeamsSelector onOpenAddWords={handleOpenAddWords} />
      {wordsModalUser && (
        <>
          <WordsSelector user={wordsModalUser} afterSubmit={closeAddWords} />
          <button onClick={closeAddWords}>Close selector</button>
        </>
      )}
      <h2>Add additional players on this device</h2>
      <AddPlayerOnComputer />
      <Words />
      {ownerIsOnComputer && (
        <button onClick={handleStartGame}>Start the game!</button>
      )}
    </div>
  );
};

export default PrepareGame;
