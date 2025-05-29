import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import RazorpayButton from "./RazorpayButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";

const Checkout = () => {
  const [checkoutId, setCheckoutId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [usdPrice, setUsdPrice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false); // For loader

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const DELIVERY_CHARGE = 0;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  if (!BACKEND_URL) console.error("Backend URL is missing!");

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart?.products?.length) {
      navigate("/");
    }
  }, [cart, navigate]);

  useEffect(() => {
    if (cart?.totalPrice && paymentMethod === "paypal") {
      convertINRtoUSD(cart.totalPrice + DELIVERY_CHARGE);
    }
  }, [cart?.totalPrice, paymentMethod]);

  const convertINRtoUSD = async (amount) => {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/INR`
      );
      const rate = response.data.rates.USD;
      const convertedAmount = (amount * rate).toFixed(2);
      setUsdPrice(convertedAmount);
      console.log("Converted INR to USD:", convertedAmount);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      setUsdPrice(null);
    }
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    setPaymentError(null);

    if (
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country ||
      !shippingAddress.phone
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setIsProcessing(true);

    if (cart?.products?.length > 0) {
      const totalAmount = cart.totalPrice + DELIVERY_CHARGE;
      try {
        const res = await dispatch(
          createCheckout({
            checkoutItems: cart.products.map((item) => ({
              productId: item.product || item._id,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
              color: item.color || "N/A",
            })),
            shippingAddress,
            paymentMethod,
            totalPrice: totalAmount,
          })
        );

        if (res.payload?._id) {
          setCheckoutId(res.payload._id);
          console.log("Checkout created successfully:", res.payload._id, res.payload);
        } else {
          alert("Failed to create checkout. Please try again.");
        }
      } catch (error) {
        console.error("Checkout creation error:", error);
        alert("Error creating checkout. Please try again.");
      }
    }

    setIsProcessing(false);
  };

  // Await payment before finalize, show loader and log everything
  const handlePaymentSuccess = async (details) => {
    if (!checkoutId) {
      console.error("Checkout ID is missing.");
      alert("Checkout ID is missing. Please try again.");
      return;
    }

    setIsVerifyingPayment(true);
    try {
      console.log("Marking checkout as paid...", checkoutId, details);
      await axios.put(
        `${BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Checkout marked as paid, proceeding to finalize...");

      await axios.post(
        `${BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Order finalized successfully");

      setIsVerifyingPayment(false);
      navigate("/order-confirmation", {
        state: {
          order: { _id: checkoutId },
          message: "Order placed successfully! Payment received.",
        },
      });
    } catch (error) {
      setIsVerifyingPayment(false);
      console.error("Payment or order finalization error:", error?.response?.data || error.message);
      alert("Payment processing failed. Please contact support.");
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment Error:", error);
    setPaymentError(error);
    if (typeof error === "string") {
      alert(error);
    } else {
      alert("Payment failed. Please try again.");
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart?.products?.length) return <p>Your cart is empty</p>;

  // Loader overlay when payment is verifying
  if (isVerifyingPayment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mb-6"></div>
        <p className="text-lg text-gray-700 font-semibold">Verifying your payment, please wait...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Section - Shipping Details */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Contact Details
            </h3>
            <input
              type="email"
              value={user?.email || ""}
              className="w-full p-3 border rounded bg-gray-100"
              disabled
            />

            <h3 className="text-lg font-semibold text-gray-700">
              Shipping Address
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 border rounded"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-3 border rounded"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                required
              />
            </div>
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 border rounded"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="City"
              className="w-full p-3 border rounded"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, city: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="w-full p-3 border rounded"
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  postalCode: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Country"
              className="w-full p-3 border rounded"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full p-3 border rounded"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Choose Payment Method
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("razorpay")}
                className={`w-full py-3 rounded-md font-semibold text-lg transition-colors ${
                  paymentMethod === "razorpay"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Pay with Razorpay 
              </button>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 rounded-md font-semibold text-lg mt-4 transition-colors ${
                isProcessing
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              {isProcessing ? "Processing..." : "Continue to Payment"}
            </button>
          </div>
        </form>
      </div>

      {/* Right Section - Order Summary */}
      <div className="bg-gray-50 shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Order Summary
        </h3>
        <div className="space-y-4">
          {cart.products.map((item, index) => (
            <div
              key={item._id || index}
              className="flex justify-between items-center border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="text-gray-800 font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  {item.color && item.color !== "N/A" && (
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                  )}
                </div>
              </div>
              <p className="text-gray-800 font-medium">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Total Amount Section */}
        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-md text-gray-700">
            <span>Subtotal:</span>
            <span>₹{cart.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-md text-gray-700">
            <span>Delivery Charge:</span>
            <span>₹{DELIVERY_CHARGE.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-semibold text-gray-800">
            <span>Total:</span>
            <span>₹{(cart.totalPrice + DELIVERY_CHARGE).toFixed(2)}</span>
          </div>
        </div>

        {/* Display payment error if any */}
        {paymentError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {paymentError}
          </div>
        )}

        {/* Display checkout buttons when checkoutId is set */}
        {checkoutId && (
          <div className="mt-6">
            <p className="text-green-600 mb-4 text-sm">
              ✓ Checkout session created successfully
            </p>
            <RazorpayButton
              checkoutId={checkoutId}
              amount={cart.totalPrice + DELIVERY_CHARGE}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;