import React, { useContext, useState } from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import PaypalButton from "./PaypalButton";
import { FirebaseContext } from "../../firebase";
import { Code } from "../../types/firebaseTypes";
import queryString from "query-string";

import history from "../../history";
import { ViewWrapper } from "../../components/Containers";
import { H1 } from "../../components/Typography";

import { LoadingView } from "../../components/Loading";
import BuyCodeForm from "./BuyCodeForm";

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

const INITIAL_FORM_VALUES = {
  email: "",
  purchaseValue: 4,
};

const BuyCode: React.FC<IProps> = () => {
  const firebase = useContext(FirebaseContext);
  const [code, setCode] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(null);
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM_VALUES);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const selectedOption = formValues
    ? PURCHASE_OPTIONS.find((o) => o.cost === formValues.purchaseValue)
    : null;

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

  return (
    <ViewWrapper>
      {!code && (
        <>
          <H1>Acheter un code</H1>
          {loading && <LoadingView />}

          {!code && !loading && !confirmed && (
            <BuyCodeForm
              initialValues={formValues}
              purchaseOptions={PURCHASE_OPTIONS}
              onSubmit={(val) => {
                setFormValues(val);
                setConfirmed(true);
              }}
            />
          )}

          {!code && !loading && confirmed && (
            <>
              <Box mb={4}>
                <Typography>
                  You are buying {selectedOption.plays} games for US$
                  {selectedOption.cost}. You will receive a code by email at{" "}
                  {formValues.email}.
                </Typography>
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  onClick={() => setConfirmed(false)}
                >
                  Change
                </Button>
              </Box>
              <Box maxWidth="500px">
                <PaypalButton
                  value={formValues.purchaseValue}
                  onApprove={async (data: any, actions: any) => {
                    handleTransactionApproved(data, actions, formValues.email);
                  }}
                />
              </Box>
            </>
          )}
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
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/games/new"
          >
            Nouvelle Partie
          </Button>
        </Box>
      )}
    </ViewWrapper>
  );
};

export default BuyCode;
