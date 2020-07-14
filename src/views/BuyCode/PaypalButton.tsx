import React, { useEffect, useRef, useContext } from "react";
import scriptLoader from "react-async-script-loader";
const CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

interface PaypalButtonProps {
  isScriptLoaded: boolean;
  isScriptLoadSucceed: boolean;
  value: string;
  onApprove: (data: any, actions: any) => void;
}

const PaypalButton: React.FC<PaypalButtonProps> = ({
  isScriptLoaded,
  isScriptLoadSucceed,
  value,
  onApprove,
}) => {
  const paypal = useRef(null);
  const buttonRef = useRef();

  const createOrder = (data: any, actions: any) => {
    // This function sets up the details of the transaction, including the amount and line item details.
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value,
          },
        },
      ],
    });
  };

  useEffect(() => {
    if (isScriptLoadSucceed && buttonRef.current) {
      const typedWindow = window as any;
      paypal.current = typedWindow.paypal;

      if (buttonRef && buttonRef.current) {
        const nonNull = buttonRef as any;
        nonNull.current.innerHTML = "";
      }
      paypal.current
        .Buttons({ createOrder, onApprove })
        .render(buttonRef.current);
    }
  }, [isScriptLoadSucceed, buttonRef.current, value, onApprove]);

  return <div ref={buttonRef}></div>;
};

export default scriptLoader(`https://paypal.com/sdk/js?client-id=${CLIENT_ID}`)(
  PaypalButton
);
