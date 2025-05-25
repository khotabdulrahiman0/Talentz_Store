import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
    return (
        <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
            <PayPalButtons 
                style={{ layout: "vertical" }} 
                createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: amount.toString() } }] })}
                onApprove={(data, actions) => actions.order.capture().then(onSuccess)}
                onError={(err) => {
                    console.error("PayPal Error:", err);
                    onError(err);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;
