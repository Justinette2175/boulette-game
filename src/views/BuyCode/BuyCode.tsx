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
} from "@material-ui/core";
import PaypalButton from "./PaypalButton";
import { FirebaseContext } from "../../firebase";
import { Code } from "../../types/firebaseTypes";
import queryString from "query-string";

import history from "../../history";
import TextInput from "../../components/TextInput";

const PURCHASE_OPTIONS = [
  { plays: 1, cost: 2 },
  { plays: 3, cost: 4 },
  { plays: 6, cost: 7 },
  { plays: 10, cost: 8 },
];

interface IProps {}

const BuyCode: React.FC<IProps> = () => {
  const firebase = useContext(FirebaseContext);
  const [code, setCode] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(null);

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
    email: Yup.string(),
    purchaseValue: Yup.number(),
  });

  return (
    <Box>
      <Formik
        validateOnMount={true}
        initialValues={{
          purchaseValue: 4,
          email: "",
        }}
        validationSchema={validationSchema}
        onSubmit={() => {
          //
        }}
      >
        {({ isValid, submitForm, setFieldValue, values }) => {
          console.log("Values email", values.email);
          return (
            <Form>
              <FormControl component="fieldset">
                <RadioGroup
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
                      label={`${o.plays} for US$${o.cost}`}
                    />
                  ))}
                </RadioGroup>
                <TextInput name="email" label="Your email" type="email" />
              </FormControl>
              {!code && !loading && (
                <PaypalButton
                  value={values.purchaseValue}
                  onApprove={async (data: any, actions: any) => {
                    console.log("values.email in onApprove", values.email);
                    handleTransactionApproved(data, actions, values.email);
                  }}
                />
              )}
            </Form>
          );
        }}
      </Formik>

      {loading && <p>loading...</p>}
      {code && (
        <Box>
          <Typography>Your code is {code}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default BuyCode;
