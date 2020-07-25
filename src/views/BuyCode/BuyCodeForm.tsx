import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  Radio,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@material-ui/core";

import TextInput from "../../components/TextInput";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    formWrapper: {
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
        padding: theme.spacing(3),
      },
    },
  });
});

interface BuyCodeFormProps {
  purchaseOptions: any;
  onSubmit: (val: any) => void;
  initialValues: {
    email: string;
    purchaseValue: number;
  };
}

const BuyCodeForm: React.FC<BuyCodeFormProps> = ({
  purchaseOptions,
  onSubmit,
  initialValues,
}) => {
  const classes = useStyles();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required(),
    purchaseValue: Yup.number().required(),
  });

  return (
    <>
      <Typography>
        Nous sommes désolés de vous faire le coup classique de vous demander de
        l’argent. Mais à plus de 3 appareils, les frais de vidéos sont trop
        élevés pour notre budget.
      </Typography>
      <Typography>
        Nos prix sont cependant remarquablement compétitifs et nos spéciaux de
        saisons plairont même aux plus Pierre-Yves Mcsween d’entre vous.
      </Typography>
      <Box bgcolor="background.paper" className={classes.formWrapper}>
        <Formik
          validateOnMount={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isValid, setFieldValue, values }) => {
            return (
              <Form>
                <Box display="flex" flexDirection="column">
                  <FormControl component="fieldset">
                    <RadioGroup
                      color="primary"
                      aria-label="gender"
                      name="gender1"
                      value={values.purchaseValue}
                      onChange={(e) =>
                        setFieldValue(
                          "purchaseValue",
                          parseInt(e.target.value),
                          true
                        )
                      }
                    >
                      {purchaseOptions.map((o: any) => (
                        <FormControlLabel
                          value={o.cost}
                          control={<Radio />}
                          label={`${o.plays} parties pour US$${o.cost}`}
                        />
                      ))}
                      <Box p={1} bgcolor="secondary.main">
                        <Typography variant="body2">
                          Spécial de saison
                        </Typography>
                        <FormControlLabel
                          disabled
                          value={20000}
                          control={<Radio />}
                          label="Illimité à vie pour US$20,000"
                        />
                      </Box>
                    </RadioGroup>
                    <TextInput
                      name="email"
                      placeholder="Courriel"
                      type="email"
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isValid}
                  >
                    Payer
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default BuyCodeForm;
