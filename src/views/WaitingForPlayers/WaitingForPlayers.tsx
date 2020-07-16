import React, { useState, useContext } from "react";
import { UserPlus, Gift, Code } from "react-feather";
import AddPlayerOnComputer from "./AddPlayerOnDevice";
import queryString from "query-string";
import history from "../../history";

import {
  Button,
  Box,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import GameLink from "../../components/GameLink";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";

import COPY from "../../copy";
import { useOwnerIsOnDevice, useGamePlayers } from "../../hooks";
import useGameRef from "../../hooks/useGameRef";

import waitForPlayers from "../../assets/images/wait-for-players.png";
import GameContext from "../../contexts/GameContext";
import EnterCode from "./EnterCode";
import { Link } from "react-router-dom";

import { H1 } from "../../components/Typography";
import { NextButton } from "../../components/Buttons";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ViewWrapper } from "../../components/Containers";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    h1: {
      [theme.breakpoints.down("xs")]: {
        maxWidth: "200px",
      },
    },
    leftBox: {
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("sm")]: {
        maxWidth: "400px",
        marginRight: theme.spacing(2),
      },
    },
    rightBox: {
      [theme.breakpoints.up("sm")]: {
        maxWidth: "400px",
      },
    },
    playersWrapper: {
      [theme.breakpoints.down("xs")]: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        width: `calc(100% + ${theme.spacing(3) * 2}px)`,
        margin: `0 -${theme.spacing(4)}px`,
        padding: `0 ${theme.spacing(4)}px`,
      },
      [theme.breakpoints.up("sm")]: {
        width: "auto",
        maxWidth: "500px",
        padding: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
      },
    },
    imageWrapper: {
      marginBottom: theme.spacing(3),
      [theme.breakpoints.down("xs")]: {
        position: "absolute",
        top: "-42px",
        left: "180px",
        width: "230px",
        transform: "rotate(-5deg)",
      },
    },
    unclockGameWrapper: {
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.down("xs")]: {
        width: `calc(100% + ${theme.spacing(3) * 2}px)`,
        margin: `0 -${theme.spacing(4)}px`,
        padding: `0 ${theme.spacing(4)}px`,
        marginTop: theme.spacing(3),
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(10),
      },
      [theme.breakpoints.up("sm")]: {
        width: "auto",
        padding: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
      },
      [theme.breakpoints.up("md")]: {
        width: "auto",
        padding: theme.spacing(4),
      },
    },
  });
});

const WaitingForPlayers: React.FC = () => {
  const searchParams = queryString.parse(history.location.search);
  const code: string = (searchParams.code as string) || "";
  const gameRef = useGameRef();
  const game = useContext(GameContext);
  const ownerIsOnDevice = useOwnerIsOnDevice();
  const language = "EN";
  const [addPlayerIsVisible, setAddPlayerIsVisible] = useState<boolean>(false);
  const players = useGamePlayers();
  const [enterCodeVisible, setEnterCodeVisible] = useState<boolean>(!!code);

  const handleStartGame = () => {
    try {
      gameRef.update({ stage: "CHOSING_WORDS" });
    } catch (e) {
      //
    }
  };

  const matches = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));
  const theme = useTheme();
  const classes = useStyles();

  return (
    <ViewWrapper>
      <Box
        display="flex"
        flexDirection={matches ? "row" : "column"}
        justifyContent="space-between"
        position="relative"
      >
        <Box flex={1} className={classes.leftBox}>
          {/* Title */}
          <H1 className={classes.h1}>Salle d'attente</H1>

          {/* Players and add player on device */}
          <Box
            mt={3}
            bgcolor="background.paper"
            className={classes.playersWrapper}
          >
            <Typography variant="h2" gutterBottom>
              {players.length} joueurs en ligne
            </Typography>
            <Grid container spacing={1}>
              {players.map((u) =>
                u.name ? (
                  <Grid item xs={12} key={u.id}>
                    <PlayerAndAvatar name={u.name} />
                  </Grid>
                ) : null
              )}
            </Grid>
            <Box mt={3}>
              <Button
                onClick={() => setAddPlayerIsVisible(true)}
                startIcon={<UserPlus size={20} />}
                variant="outlined"
                color="primary"
              >
                joueur.euse sur cet appareil
              </Button>
            </Box>
          </Box>

          {/* Sharing instructions */}
          <Box mt={3}>
            <Typography variant="body1" gutterBottom>
              Partagez ce lien avec vos ami.e.s pour ajouter des appareils.
            </Typography>
            <GameLink />
          </Box>

          {/* Next Button */}
          {ownerIsOnDevice && (
            <NextButton>
              <Button
                disabled={players.length < 4}
                onClick={handleStartGame}
                color="primary"
                variant="contained"
                size="large"
              >
                Commencer la partie
              </Button>
              {players.length < 4 && (
                <Box mt={1}>
                  <Typography variant="caption">
                    Il faut au minimum 4 joueur.euse.s pour commencer la partie.
                  </Typography>
                </Box>
              )}
            </NextButton>
          )}
        </Box>

        <Box flex={1} className={classes.rightBox}>
          {/* Image */}
          <Box
            display="flex"
            justifyContent="center"
            className={classes.imageWrapper}
          >
            <Box maxWidth="350px">
              <img
                width="100%"
                style={{ maxWidth: "400px" }}
                src={waitForPlayers}
                alt="Girl whistling"
              />
            </Box>
          </Box>

          {/* Unlock game */}
          <Box className={classes.unclockGameWrapper} bgcolor="primary.dark">
            {game.payment.paid === true ? (
              <>
                <Typography variant="h2">Cette partie est débloquée</Typography>
                <Typography variant="body1">
                  Vous pouvez maintenant connecter jusqu'à 10 appareils sur
                  cette partie.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h2">Débloquer plus d'appareils</Typography>
                <Typography variant="body1">
                  Limité à 3 appareils maximum pour la version gratuite. Achetez
                  un code pour jouer à jusqu’à 10 appareils.
                </Typography>
                <Box display="flex" flexDirection="column" mt={3}>
                  <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<Code size={20} />}
                    style={{ marginBottom: theme.spacing(1) }}
                    onClick={() => setEnterCodeVisible(true)}
                  >
                    J'ai déjà un code
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    startIcon={<Gift size={20} />}
                    component={Link}
                    to={`/buycode?gameId=${game.id}`}
                  >
                    Acheter un code
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Add Player Modal */}
      <AddPlayerOnComputer
        open={addPlayerIsVisible}
        onClose={() => setAddPlayerIsVisible(false)}
      />

      <EnterCode
        code={code}
        open={enterCodeVisible && !game?.payment?.paid}
        onClose={() => setEnterCodeVisible(false)}
      />
    </ViewWrapper>
  );
};

export default WaitingForPlayers;
