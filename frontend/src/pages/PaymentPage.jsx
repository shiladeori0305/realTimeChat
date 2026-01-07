import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    console.log("✅ PaymentPage Loaded");
  }, []);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const stripe = await stripePromise;

  try {
    const response = await axios.post("/api/payment/create-payment-intent", {
      amount: amount * 100, // Convert amount to cents
    });

    console.log("Response:", response.data); // Add logging to see the response

    const { clientSecret } = response.data;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: {
          // Provide card details here or use a Stripe element
        },
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      console.log("Payment succeeded:", result.paymentIntent);
    }
  } catch (error) {
    console.error("Payment failed", error);
  }
};

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-black mb-4">Payment Page</h1>
      <p className="text-gray-700 mb-4">Here you can handle your payment process.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <label htmlFor="amount" className="text-lg font-medium">Enter Amount:</label>
        <input
          type="number"
          id="amount"
          className="input input-bordered rounded-lg p-2"
          placeholder="Enter amount"
          value={amount}
          onChange={handleAmountChange}
          required
        />
        <button type="submit" className="btn btn-primary mt-4">Send</button>
      </form>
    </div>
  );
};

export default PaymentPage;