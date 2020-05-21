import React from "react";
import { Typography, Box, Button, Grid } from "@material-ui/core";
import { DollarSign, Server, Heart, Home } from "react-feather";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      alignItems: "flex-end",
    },
    item: {
      maxWidth: "200px",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      "& svg": {
        stroke: theme.palette.primary.main,
        fill: theme.palette.primary.light,
      },
    },
    button: {
      alignSelf: "center",
      marginTop: theme.spacing(1),
    },
  });
});

const OPTIONS = [
  {
    amount: 5,
    text: "Show some love... :)",
    icon: "heart",
    link: "https://www.paypal.me/justinegagnepain/5CAD?locale.x=en_US",
  },
  {
    amount: 10,
    text: "Help cover server costs",
    icon: "server",
    link: "https://www.paypal.me/justinegagnepain/10CAD?locale.x=en_US",
  },
  {
    amount: 25,
    text: "Grow my cashdown <3",
    icon: "home",
    link: "https://www.paypal.me/justinegagnepain/25CAD?locale.x=en_US",
  },
];

const Donate = () => {
  const classes = useStyles();

  const getIcon = (icon: string) => {
    switch (icon) {
      case "heart":
        return <Heart size={40} />;
      case "server":
        return <Server size={40} />;
      case "home":
        return <Home size={40} />;
    }
  };

  return (
    <>
      <Grid container spacing={2} classes={{ root: classes.container }}>
        {OPTIONS.map((o, i) => (
          <Grid item classes={{ root: classes.item }} sm>
            <Box mb={1}>{getIcon(o.icon)}</Box>
            <Typography variant="body2">{o.text}</Typography>

            <a href={o.link} rel="noopener noreferrer" target="_blank">
              <Button
                startIcon={<DollarSign size={16} />}
                color="primary"
                variant="outlined"
                classes={{ root: classes.button }}
              >
                {o.amount} CAD
              </Button>
            </a>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Donate;
