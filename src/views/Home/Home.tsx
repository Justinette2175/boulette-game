import React from "react";
import { ViewWrapper } from "../../components/Containers";
import { H1 } from "../../components/Typography";
import { Typography, Button, Box } from "@material-ui/core";
import { NextButton } from "../../components/Buttons";
import { Link } from "react-router-dom";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <ViewWrapper>
      <Box maxWidth="500px">
        <H1>Bienvenue sur boulette.ca...</H1>
        <Typography>
          ...le seul site internet qui vous permet de jouer à la boulette avec
          vos ami.e.s de la station spatiale internationale sans avoir à vous
          déplacer.
        </Typography>
        <Typography>
          Si vous n’avez jamais joué à la boulette, vous trouverez ICI notre
          suggestion de règlements. Si vous savez jouer, laissez-vous envoûter
          par l’ambiance chaleureuse de notre application et amusez-vous.
        </Typography>

        <NextButton>
          <Button
            size="large"
            color="primary"
            variant="contained"
            component={Link}
            to="/games/new"
          >
            Creer une partie
          </Button>
        </NextButton>
      </Box>
    </ViewWrapper>
  );
};

export default Home;
