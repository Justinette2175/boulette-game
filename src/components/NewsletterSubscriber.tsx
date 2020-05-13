import React, { useState } from "react";
import { TextField, Button, Box } from "@material-ui/core";
import * as Yup from "yup";

const NewsletterSubscriber: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  let schema = Yup.string().email();
  return (
    <form
      action="https://boulette.us18.list-manage.com/subscribe/post"
      method="POST"
      noValidate
    >
      <input type="hidden" name="u" value="fc1cde456830fecd8793f55b6" />
      <input type="hidden" name="id" value="857680a6e5" />
      <Box my={2}>
        <TextField
          fullWidth
          label="Your email"
          name="EMAIL"
          id="MERGE0"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        disabled={!email || !schema.isValidSync(email)}
        type="submit"
        value="Subscribe"
        name="subscribe"
        id="mc-embedded-subscribe"
      >
        Submit
      </Button>

      <div aria-hidden="true" style={{ visibility: "hidden" }}>
        <input
          type="text"
          name="b_fc1cde456830fecd8793f55b6_857680a6e5"
          value=""
        />
      </div>
      <div style={{ visibility: "hidden" }}>
        <input
          type="submit"
          value="Subscribe"
          name="subscribe"
          id="mc-embedded-subscribe"
          className="button"
        />
      </div>
    </form>
  );
};

export default NewsletterSubscriber;
