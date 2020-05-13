import React from "react";
import { Box, Typography } from "@material-ui/core";
import NewsletterSubscriber from "../../components/NewsletterSubscriber";

const SmallScreenView: React.FC = () => {
  return (
    <Box m={6} display="flex" flexDirection="column" align-items="center">
      <Box maxWidth="400px">
        <Typography variant="h1" gutterBottom>
          Your screen is too small...
        </Typography>
        <Typography variant="body1" gutterBottom>
          I haven't gotten around to implementing this game on smaller devices
          like cell phones yet... For now, try switching to a device with a
          large screen, like a laptop, or a tablet in horizontal orientation.
        </Typography>
        <Typography variant="body1" gutterBottom>
          If you want to stay aware of new features, sign up to the boulette.ca
          newsletter!
        </Typography>
        <NewsletterSubscriber />
      </Box>
    </Box>
  );
};

export default SmallScreenView;
