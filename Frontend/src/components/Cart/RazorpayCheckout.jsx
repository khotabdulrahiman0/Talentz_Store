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

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const DELIVERY_CHARGE = 50;
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
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      setUsdPrice(null);
    }
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

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
              productId: item.product || item._id, // Handle both cases
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
          console.log("Checkout created successfully:", res.payload._id);
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

  const handlePaymentSuccess = async (details) => {
    if (!checkoutId) {
      console.error("Checkout ID is missing.");
      alert("Checkout ID is missing. Please try again.");
      return;
    }

    try {
      console.log("Processing payment for checkout:", checkoutId);
      
      const response = await axios.put(
        `${BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log("Payment processed successfully:", response.data);
      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      alert("Payment processing failed. Please contact support.");
    }
  };

  const handleFinalizeCheckout = async (id) => {
    if (!id) {
      console.error("Checkout ID is missing.");
      return;
    }

    try {
      console.log("Finalizing checkout:", id);
      
      const response = await axios.post(
        `${BACKEND_URL}/api/checkout/${id}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log("Checkout finalized successfully:", response.data);
      
      // Navigate to success page
      navigate("/order-confirmation", { 
        state: { 
          order: response.data,
          message: "Order placed successfully!" 
        } 
      });
      
    } catch (error) {
      console.error("Finalize Checkout Error:", error.response?.data || error.message);
      alert("Order finalization failed. Please contact support.");
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart?.products?.length) return <p>Your cart is empty</p>;

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
                Pay with Razorpay (India)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`w-full py-3 rounded-md font-semibold text-lg transition-colors ${
                  paymentMethod === "paypal"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Pay with PayPal (Global)
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

        {/* Display checkout buttons when checkoutId is set */}
        {checkoutId && (
          <div className="mt-6">
            <p className="text-green-600 mb-4 text-sm">
              ✓ Checkout session created successfully
            </p>
            {paymentMethod === "paypal" ? (
              usdPrice ? (
                <PayPalButton
                  amount={usdPrice}
                  onSuccess={handlePaymentSuccess}
                />
              ) : (
                <p className="text-gray-500">Fetching exchange rate...</p>
              )
            ) : (
              <>
                <RazorpayButton
                  checkoutId={checkoutId}
                  amount={cart.totalPrice + DELIVERY_CHARGE}
                  onSuccess={handlePaymentSuccess}
                />
                {/* Temporary test button - remove this in production */}
                <button
                  onClick={() => handlePaymentSuccess({ test_payment: true })}
                  className="w-full bg-gray-600 text-white py-2 rounded-md font-semibold text-sm hover:bg-gray-700 transition-colors mt-2"
                >
                  Test Payment (Remove in Production)
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;