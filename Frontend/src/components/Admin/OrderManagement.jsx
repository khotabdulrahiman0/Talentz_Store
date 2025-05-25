import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus, clearError } from "../../redux/slices/adminOrderSlice";
// import { Search, Filter, Calendar, ArrowUpDown, Info } from "react-feather";
import { FiFilter, FiCalendar, FiSearch, FiInfo } from "react-icons/fi";
import { BiSort } from "react-icons/bi";

const OrderStatusOptions = {
  Processing: "Processing",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
};

const statusOrder = {
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 3,
};

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateSort, setDateSort] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "admin") {
      navigate("/unauthorized");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleStatusChange = async (orderId, status) => {
    try {
      setStatusUpdating(orderId);
      await dispatch(updateOrderStatus({ id: String(orderId), status })).unwrap();
    } catch (error) {
      console.error(error.message || "Failed to update order status");
    } finally {
      setStatusUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Processing: "bg-yellow-100 text-yellow-800",
      Shipped: "bg-blue-100 text-blue-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const toggleDateSort = () => {
    setDateSort(dateSort === "asc" ? "desc" : "asc");
  };

  const filteredOrders = orders
    .filter((order) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        order._id.toLowerCase().includes(searchLower) ||
        (order.user?.name || "").toLowerCase().includes(searchLower) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchLower));

      // Status filter
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateSort === "asc" ? dateA - dateB : dateB - dateA;
    });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="stats-card flex space-x-4">
            <div className="px-4 py-2 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold">{orders.length}</p>
            </div>
            <div className="px-4 py-2 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-xl font-bold">
                {orders.filter(order => order.status === "Delivered").length}
              </p>
            </div>
            <div className="px-4 py-2 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-500">Processing</p>
              <p className="text-xl font-bold">
                {orders.filter(order => order.status === "Processing").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search orders by ID, customer, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiFilter className="w-5 h-5 text-gray-400" />
              </div>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-3 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                {Object.values(OrderStatusOptions).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={toggleDateSort}
              className="flex items-center justify-center gap-2 bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-3 hover:bg-gray-100"
            >
              <FiCalendar className="w-5 h-5" />
              Date {dateSort === "desc" ? "Newest" : "Oldest"}
              <BiSort className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const isFinalStatus =
                    order.status === OrderStatusOptions.Delivered || order.status === OrderStatusOptions.Cancelled;
                  const orderDate = new Date(order.createdAt).toLocaleDateString();
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/admin/orders/${order._id}`} className="text-blue-600 hover:underline font-medium">
                          #{order._id.slice(-6)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{order.user?.name || "Unknown"}</div>
                        <div className="text-sm text-gray-500">{order.user?.email || "No email"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {orderDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items && order.items.length > 0 ? (
                            <div>
                              <p className="font-medium">{order.items[0].name} {order.items[0].quantity > 1 && `(x${order.items[0].quantity})`}</p>
                              {order.items.length > 1 && (
                                <p className="text-gray-500">+{order.items.length - 1} more items</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">No items</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{order.totalPrice.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {!isFinalStatus ? (
                          <div className="relative">
                            <select
                              className="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              disabled={statusUpdating === order._id}
                            >
                              {Object.values(OrderStatusOptions)
                                .filter((status) => statusOrder[status] >= statusOrder[order.status])
                                .map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                            </select>
                            {statusUpdating === order._id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                                <div className="w-5 h-5 border-b-2 border-gray-600 rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                          >
                            <FiInfo className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <FiFilter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Order #{selectedOrder._id.slice(-6)}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedOrder(null)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{selectedOrder.user?.name || "Unknown Customer"}</p>
                <p className="text-gray-700">{selectedOrder.user?.email || "No email"}</p>
                <p className="text-gray-700">{selectedOrder.shippingAddress?.phone || "No phone"}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Shipping Address</h4>
                {selectedOrder.shippingAddress ? (
                  <div className="text-gray-700">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No shipping address provided</p>
                )}
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items && selectedOrder.items.map((item) => (
                        <tr key={item._id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">₹{item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="3">
                          Total
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          ₹{selectedOrder.totalPrice.toFixed(2)}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;