import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderDetails } from '../redux/slices/orderSlice';
import { FiPackage, FiCreditCard, FiTruck, FiCalendar, FiArrowLeft, FiUser, FiMapPin, FiPhone } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdPayment } from 'react-icons/md';

const AdminOrdersDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { orderDetails, loading, error } = useSelector((state) => state.orders);
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [deliveryStatus, setDeliveryStatus] = useState(false);

    useEffect(() => {
        dispatch(fetchOrderDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (orderDetails) {
            setPaymentStatus(orderDetails.isPaid);
            setDeliveryStatus(orderDetails.isDelivered);
        }
    }, [orderDetails]);

    // Since we don't have the updateOrderStatus export, we'll handle status changes locally
    // In a real app, you would dispatch an action to update the backend
    const handlePaymentStatusChange = () => {
        const newStatus = !paymentStatus;
        setPaymentStatus(newStatus);
        // Show a toast or notification instead of actual API call
        console.log(`Payment status updated to: ${newStatus ? 'Paid' : 'Pending'}`);
    };

    const handleDeliveryStatusChange = () => {
        const newStatus = !deliveryStatus;
        setDeliveryStatus(newStatus);
        // Show a toast or notification instead of actual API call
        console.log(`Delivery status updated to: ${newStatus ? 'Delivered' : 'Processing'}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50">
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3 shadow-sm">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-600 font-medium">Error: {error}</p>
            </div>
        </div>
    );

    if (!orderDetails) return (
        <div className="max-w-7xl mx-auto p-6 text-center bg-gray-50">
            <p className="text-gray-600">No order details found</p>
        </div>
    );

    const orderDate = new Date(orderDetails.createdAt);
    const estimatedDeliveryDate = new Date(orderDate);
    estimatedDeliveryDate.setDate(orderDate.getDate() + Math.floor(Math.random() * (7 - 3 + 1) + 3));

    // Calculate subtotal
    const subtotal = orderDetails.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Placeholder values for shipping and tax
    const shipping = 5.99;
    const tax = subtotal * 0.05;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-6">
                    <Link to="/admin/orders" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mr-4">
                        <FiArrowLeft className="mr-2" />
                        <span className="font-medium">Back to Orders</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 ml-2">Order Details</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center">
                                        <HiOutlineDocumentText className="h-6 w-6 text-indigo-600 mr-2" />
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Order #{orderDetails._id.slice(-8)}
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiCalendar className="text-gray-500" />
                                        <span className="text-sm text-gray-500">
                                            {orderDate.toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-base font-semibold text-gray-900 mb-3">Items</h3>
                                <div className="divide-y divide-gray-200">
                                    {orderDetails.orderItems.map((item, index) => (
                                        <div key={item._id || `item-${index}`} className="py-4 flex items-start">
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-20 h-20 object-cover rounded-md flex-shrink-0" 
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between">
                                                    <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
                                                    <p className="text-base font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                                                    <p>Qty: {item.quantity}</p>
                                                    {item.size && <p>Size: {item.size}</p>}
                                                    {item.color && (
                                                        <div className="flex items-center gap-1">
                                                            <span>Color:</span>
                                                            <div
                                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                                style={{ backgroundColor: item.color }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Information */}
                            {orderDetails.shippingAddress && (
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-base font-semibold text-gray-900 mb-3">Customer Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="flex items-center text-sm font-medium text-gray-700">
                                                <FiUser className="mr-2 text-gray-500" />
                                                Customer Details
                                            </h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {orderDetails.user?.name || 'Customer Name'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {orderDetails.user?.email || 'customer@example.com'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {orderDetails.shippingAddress.phoneNumber || 'No phone provided'}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="flex items-center text-sm font-medium text-gray-700">
                                                <FiMapPin className="mr-2 text-gray-500" />
                                                Shipping Address
                                            </h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {orderDetails.shippingAddress.address}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postalCode}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {orderDetails.shippingAddress.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Status and Summary */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Order Status</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <MdPayment className="mr-2 text-lg text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Payment Status</span>
                                    </div>
                                    <button
                                        onClick={handlePaymentStatusChange}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                            paymentStatus 
                                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                        }`}
                                    >
                                        {paymentStatus ? 'Paid' : 'Pending'}
                                    </button>
                                </div>
                                
                                {/* <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FiTruck className="mr-2 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Delivery Status</span>
                                    </div>
                                    <span 
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            deliveryStatus 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {deliveryStatus ? 'Delivered' : 'Processing'}
                                    </span>
                                </div> */}

                        
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FiCalendar className="mr-2 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Expected Delivery</span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {deliveryStatus 
                                            ? 'Delivered' 
                                            : estimatedDeliveryDate.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                              })
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Payment Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Payment Summary</h3>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">₹50</span>
                                </div>
                                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                                    <span className="font-medium">Total</span>
                                    <span className="font-bold text-lg">₹{orderDetails.totalPrice.toFixed(2)}</span>
                                </div>
                                
                                <div className="mt-4 text-xs text-gray-500">
                                    <div className="flex items-center">
                                        <FiCreditCard className="mr-1" />
                                        <span>Payment Method: {orderDetails.paymentMethod || 'Credit Card'}</span>
                                    </div>
                                    {orderDetails.isPaid && orderDetails.paidAt && (
                                        <div className="flex items-center mt-1">
                                            <span>Paid on: {new Date(orderDetails.paidAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Actions</h3>
                            
                            <div className="space-y-3">
                                <button 
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                    onClick={() => alert('Tracking update feature would be implemented here')}
                                >
                                    <FiPackage className="mr-2" />
                                    Update Tracking
                                </button>
                                <button 
                                    className="w-full bg-white text-indigo-600 border border-indigo-600 py-2 px-4 rounded-md hover:bg-indigo-50 transition-colors flex items-center justify-center"
                                    onClick={() => alert('Invoice generation feature would be implemented here')}
                                >
                                    <HiOutlineDocumentText className="mr-2" />
                                    Generate Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersDetailPage;