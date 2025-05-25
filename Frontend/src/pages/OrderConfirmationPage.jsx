import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    console.log("Checkout Data:", checkout);
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your purchase. We've sent a confirmation email with
            your order details.
          </p>
        </div>

        {/* Order Summary Card */}
        {checkout && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Order Meta Section */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Order Number
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {checkout._id}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Order Date
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Date(checkout.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-gray-500">
                    Est. Delivery
                  </h3>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    {calculateEstimatedDelivery(checkout.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Items
              </h2>
              <div className="space-y-6">
                {checkout.checkoutItems.map((item) => (
                  <div key={item.productId} className="flex items-start">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-base font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.color} / {item.size}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>Qty: {item.quantity}</span>
                        <span className="mx-2">•</span>
                        <span>₹{item.price}</span> 
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-gray-900">
                        ₹{((item.price + 50) * item.quantity).toFixed(2)}{" "}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Grid */}
            <div className="p-8 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="h-6 w-6 text-gray-500 mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Payment Information
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium text-gray-900">
                      {checkout.paymentMethod || "Not Available"}
                    </p>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="h-6 w-6 text-gray-500 mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM3 16a4 4 0 018 0v4H3v-4zm12-4a4 4 0 014 4v4h-4v-4z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8h18M3 8v10h18V8m-18 0l3-4h12l3 4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Shipping Address
                    </h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium text-gray-900">
                      {checkout.shippingAddress.address},<br />
                      {checkout.shippingAddress.city},{" "}
                      {checkout.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-block px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Need help?{" "}
            <a href="/contact" className="text-green-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
