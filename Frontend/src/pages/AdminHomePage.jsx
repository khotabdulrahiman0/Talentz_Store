import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminProducts } from '../redux/slices/adminProductSlice';
import { fetchAllOrders } from '../redux/slices/adminOrderSlice';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { products, loading: productsLoading, error: productsError } = useSelector(state => state.adminProducts);
    const { orders, totalOrders, totalSales, loading: ordersLoading, error: ordersError } = useSelector(state => state.adminOrders);

    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchAllOrders());
    }, [dispatch]);

    if (productsLoading || ordersLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (productsError || ordersError) {
        return (
            <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
                <p>Error: {productsError || ordersError}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
                    <p className="text-2xl font-bold text-green-600">₹{totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-lg font-semibold text-gray-700">Total Orders</h2>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                    <Link to="/admin/orders" className="text-blue-500 hover:underline">Manage Orders</Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-lg font-semibold text-gray-700">Total Products</h2>
                    <p className="text-2xl font-bold">{products.length}</p>
                    <Link to="/admin/products" className="text-blue-500 hover:underline">Manage Products</Link>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                {orders.length > 0 ? (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full table-auto border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-3">Order ID</th>
                                    <th className="border p-3">User</th>
                                    <th className="border p-3">Total Price</th>
                                    <th className="border p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map(order => (
                                    <tr key={order._id} className="text-center border-b">
                                        <td className="p-3 border">{order._id.slice(-6)}</td>
                                        <td className="p-3 border">{order.user.name}</td>
                                        <td className="p-3 border">₹{order.totalPrice}</td>
                                        <td className="p-3 border">{order.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No recent orders found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminHomePage;
