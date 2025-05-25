import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderDetails } from '../redux/slices/orderSlice';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { orderDetails, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrderDetails(id));
    }, [dispatch, id]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-600 font-medium">Error: {error}</p>
            </div>
        </div>
    );

    if (!orderDetails) return (
        <div className="max-w-7xl mx-auto p-6 text-center">
            <p className="text-gray-600">No order details found</p>
        </div>
    );

    const orderDate = new Date(orderDetails.createdAt);
    const estimatedDeliveryDate = new Date(orderDate);
    estimatedDeliveryDate.setDate(orderDate.getDate() + Math.floor(Math.random() * (7 - 3 + 1) + 3));

    // Calculate subtotal (original price of all products)
    const subtotal = orderDetails.orderItems.reduce(
        (acc, item) => acc + (item.price * item.quantity), 
        0
    );

    // Calculate delivery charges (assuming it's the difference between total and subtotal)
    // If you have a specific field for delivery charges in your order model, use that instead
    const deliveryCharges = orderDetails.totalPrice - subtotal;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Details</h1>
                <Link to="/my-orders" className="text-blue-600 hover:underline mt-2 inline-block">
                    &larr; Back to Orders
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Order #{orderDetails._id.slice(-8)}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Placed on {orderDate.toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                orderDetails.isPaid 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                Payment: {orderDetails.isPaid ? 'Paid' : 'Pending'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                orderDetails.isDelivered 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                Delivery: {orderDetails.isDelivered ? 'Delivered' : 'Processing'}
                            </span>
                            <span className="text-sm text-gray-600">
                                Estimated Delivery: {orderDetails.isDelivered ? 'Already Delivered' : estimatedDeliveryDate.toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orderDetails.orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <img className="h-12 w-12 object-cover rounded-md" src={item.image} alt={item.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    {item.size && item.color && (
                                                        <div className="text-xs text-gray-500">
                                                            Size: {item.size}, Color: {item.color}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                            ₹{item.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border-b border-gray-200">
                    {/* Payment Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Information</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p>Method: {orderDetails.paymentMethod}</p>
                            {orderDetails.isPaid && (
                                <p>Paid on: {new Date(orderDetails.paidAt).toLocaleDateString()}</p>
                            )}
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Information</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            {orderDetails.shippingAddress && (
                                <>
                                    <p>{orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
                                    <p>{orderDetails.shippingAddress.address}</p>
                                    <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country}</p>
                                    <p>{orderDetails.shippingAddress.postalCode}</p>
                                    <p>Phone: {orderDetails.shippingAddress.phone}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Charges:</span>
                                <span className="text-gray-900">₹{deliveryCharges.toFixed(2)}</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                                <span className="font-medium text-gray-900">Total:</span>
                                <span className="font-bold text-gray-900">₹{orderDetails.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;