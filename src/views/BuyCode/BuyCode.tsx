import React, { useContext, useState } from "react";
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
import PaypalButton from "./PaypalButton";
import { FirebaseContext } from "../../firebase";
import { Code } from "../../types/firebaseTypes";
import queryString from "query-string";

import history from "../../history";
import TextInput from "../../components/TextInput";
import { ViewWrapper } from "../../components/Containers";
import { H1 } from "../../components/Typography";

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

const PURCHASE_OPTIONS = [
  { plays: 1, cost: 2 },
  { plays: 3, cost: 4 },
  { plays: 6, cost: 7 },
  { plays: 10, cost: 8 },
];

interface IProps {}

interface FormValues {
  email: string;
  purchaseValue: number;
}

const BuyCode: React.FC<IProps> = () => {
  const firebase = useContext(FirebaseContext);
  const [code, setCode] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(null);
  const [formValues, setFormValues] = useState<FormValues>(null);

  const classes = useStyles();

  const createCouponCode = async (
    email: string,
    paypalTransactionId: string,
    payer: any,
    amount: number,
    currency: string,
    time: string
  ) => {
    const newCodeRef = firebase.firestore().collection("codes").doc();
    const plays = PURCHASE_OPTIONS.find((p) => p.cost === amount)?.plays;
    const batch = firebase.firestore().batch();
    const newCode: Code = {
      numberOfPlays: plays,
      playsUsed: 0,
      paypalTransactionId,
      createdOn: time,
      cost: amount,
      currency,
      email,
    };
    batch.set(newCodeRef.collection("private").doc("payer"), payer);
    batch.set(newCodeRef, newCode);
    await batch.commit();
    return newCodeRef.id;
  };

  const redirectToGame = (redirectCode: string) => {
    const searchParams = queryString.parse(history.location.search);
    if (searchParams.gameId) {
      history.push(`/games/${searchParams.gameId}?code=${redirectCode}`);
    }
  };

  const handleTransactionApproved = async (
    data: any,
    actions: any,
    email: string
  ) => {
    try {
      const transactionDetails = await actions.order.capture();
      setLoading(true);
      const code = await createCouponCode(
        email,
        transactionDetails.id,
        transactionDetails.payer,
        parseInt(transactionDetails.purchase_units[0].amount.value),
        transactionDetails.purchase_units[0].amount.currency_code,
        transactionDetails.create_time
      );
      setLoading(false);
      setCode(code);
      redirectToGame(code);
    } catch (e) {
      console.log("Error:BuyCode:handleTransactionApproved", e);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required(),
    purchaseValue: Yup.number().required(),
  });

  return (
    <ViewWrapper>
      {!code && (
        <>
          <H1>Acheter un code</H1>
          <Typography>
            Nous sommes désolés de vous faire le coup classique de vous demander
            de l’argent. Mais à plus de 3 appareils, les frais de vidéos sont
            trop élevés pour notre budget.
          </Typography>
          <Typography>
            Nos prix sont cependant remarquablement compétitifs et nos spéciaux
            de saisons plairont même aux plus Pierre-Yves Mcsween d’entre vous.
          </Typography>
          <Box bgcolor="background.paper" className={classes.formWrapper}>
            <Formik
              validateOnMount={true}
              initialValues={{
                purchaseValue: 4,
                email: "",
              }}
              validationSchema={validationSchema}
              onSubmit={setFormValues}
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
                          {PURCHASE_OPTIONS.map((o) => (
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
                        disabled={!isValid || loading}
                      >
                        Payer
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>

          {!code && !loading && formValues && (
            <PaypalButton
              value={formValues.purchaseValue}
              onApprove={async (data: any, actions: any) => {
                handleTransactionApproved(data, actions, formValues.email);
              }}
            />
          )}

          {loading && <p>loading...</p>}
        </>
      )}

      {code && (
        <Box>
          <H1>Bravo!</H1>
          <Typography>
            L’économie et nous-même vous remercions pour cet acte de
            consommation. Votre code est
            {code}. Vous le recevrez aussi par courriel.
          </Typography>
        </Box>
      )}
    </ViewWrapper>
  );
};

export default BuyCode;
