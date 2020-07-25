import React from "react";

import { SidePaddingWrapper } from "../Containers";
import { Typography, Grid, Container, Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Mail, Lock } from "react-feather";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    footer: {
      minHeight: "100px",
      backgroundColor: theme.palette.primary.dark,
      display: "flex",
      flexGrow: 1,
      color: "white",
      "& p": {
        marginBottom: 0,
      },
    },
  });
});

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg" disableGutters>
        <SidePaddingWrapper>
          <Box pt={4} pb={[15, 4]}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  component="h1"
                  style={{ fontWeight: 700, marginBottom: 0 }}
                >
                  boulette.ca
                </Typography>
                <Typography>Proudly built in Montreal, Canada.</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <Mail size={15} style={{ marginRight: "8px" }} />
                  info@boulette.ca
                </Typography>

                <Typography
                  component={Link}
                  to="/privacypolicy"
                  style={{ color: "white" }}
                >
                  <Lock size={15} style={{ marginRight: "8px" }} /> Read our
                  Privacy Policy
                </Typography>

                <Typography>© 2020 Justine Gagnepain</Typography>
              </Grid>
            </Grid>
          </Box>
        </SidePaddingWrapper>
      </Container>
    </footer>
  );
};

export default Footer;
