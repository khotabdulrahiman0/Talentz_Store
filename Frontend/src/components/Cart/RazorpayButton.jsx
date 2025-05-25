import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RazorpayButton = ({ amount, onSuccess, onError, checkoutId }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setIsScriptLoaded(true);
      return;
    }

    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      if (onError) onError('Failed to load payment gateway. Please refresh the page.');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onError]);

  const createRazorpayOrder = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(
        `${BACKEND_URL}/api/checkout/${checkoutId}/razorpay-order`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            'Content-Type': 'application/json'
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      console.error('Razorpay script not loaded');
      if (onError) onError('Razorpay script not loaded. Please refresh the page.');
      return;
    }

    // Validate amount
    if (!amount || amount <= 0) {
      console.error('Invalid amount:', amount);
      if (onError) onError('Invalid payment amount');
      return;
    }

    // Check if checkoutId exists
    if (!checkoutId) {
      console.error('Checkout ID is missing');
      if (onError) onError('Checkout session not found. Please try again.');
      return;
    }

    // Check if Razorpay key exists
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
    if (!razorpayKey) {
      console.error('Razorpay key is missing');
      if (onError) onError('Payment configuration error. Please contact support.');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create Razorpay order on server
      console.log('Creating Razorpay order for checkout:', checkoutId);
      const orderData = await createRazorpayOrder();
      console.log('Razorpay order created:', orderData);

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: "INR",
        name: "ARMK Store",
        description: `Order Payment - Checkout ID: ${checkoutId}`,
        order_id: orderData.orderId, // Use the server-generated order ID
        handler: function (response) {
          console.log('Payment successful:', response);
          setIsLoading(false);
          
          // Call success callback with payment details
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            method: 'razorpay'
          });
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setIsLoading(false);
            if (onError) onError('Payment cancelled by user');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      // Handle payment failures
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setIsLoading(false);
        if (onError) {
          onError(`Payment failed: ${response.error.description || 'Unknown error'}`);
        }
      });

      rzp.open();

    } catch (error) {
      console.error('Error in payment process:', error);
      setIsLoading(false);
      if (onError) {
        const errorMessage = error.response?.data?.msg || error.message || 'Failed to initiate payment';
        onError(`Payment initialization failed: ${errorMessage}`);
      }
    }
  };

  return (
    <div>
      <button 
        onClick={handlePayment} 
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!amount || amount <= 0 || !isScriptLoaded || isLoading || !checkoutId}
      >
        {isLoading ? 'Processing...' : 
         !isScriptLoaded ? 'Loading Payment Gateway...' : 
         `Pay ₹${amount} with Razorpay`}
      </button>
      
      {/* Debug info - remove in production */}
      <div className="mt-2 text-xs text-gray-600">
        <p>Amount: ₹{amount} (₹{Math.round(amount * 100)} paise)</p>
        <p>Razorpay Key: {import.meta.env.VITE_RAZORPAY_KEY ? 'Present' : 'Missing'}</p>
        <p>Script Loaded: {isScriptLoaded ? 'Yes' : 'No'}</p>
        <p>Checkout ID: {checkoutId || 'Not provided'}</p>
        <p>Backend URL: {import.meta.env.VITE_BACKEND_URL || 'Missing'}</p>
      </div>
    </div>
  );
};

export default RazorpayButton;