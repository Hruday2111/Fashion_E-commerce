import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/orders/', {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await res.json();

        if (data.orders.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => 
        item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTab = activeTab === 'all' || 
      (activeTab === 'not-shipped' && order.orderStatus !== 'Shipped' && order.orderStatus !== 'Delivered') ||
      (activeTab === 'cancelled' && order.orderStatus === 'Cancelled');

    return matchesSearch && matchesTab;
  });

  const getDeliveryDate = (createdAt, orderStatus) => {
    const orderDate = new Date(createdAt);
    if (orderStatus === 'Delivered') {
      const deliveredDate = new Date(orderDate);
      deliveredDate.setDate(deliveredDate.getDate() + 8);
      return `Delivered ${deliveredDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`;
    } else {
      const expectedDate = new Date(orderDate);
      expectedDate.setDate(expectedDate.getDate() + 5);
      return `Expected delivery ${expectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-700">My Orders</h2>
              <p className="text-gray-500 mt-1">Track your orders and delivery status</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors shadow-sm border-2 focus:outline-none text-base
                ${activeTab === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveTab('not-shipped')}
              className={`px-6 py-2 rounded-full font-medium transition-colors shadow-sm border-2 focus:outline-none text-base
                ${activeTab === 'not-shipped' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
            >
              Not Shipped
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-6 py-2 rounded-full font-medium transition-colors shadow-sm border-2 focus:outline-none text-base
                ${activeTab === 'cancelled' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex flex-wrap gap-8 md:gap-12">
                      <div>
                        <p className="text-xs text-indigo-200 font-medium">ORDER PLACED</p>
                        <p className="text-white font-semibold text-base">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-indigo-200 font-medium">TOTAL</p>
                        <p className="text-white font-semibold text-base">₹{order.totalAmount?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-indigo-200 font-medium">SHIP TO</p>
                        <p className="text-white font-semibold text-base">
                          {order.shippingAddress?.fullName || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <p className="text-xs text-indigo-200 font-medium">ORDER #</p>
                      <p className="text-white font-mono font-semibold text-base">{order.orderId}</p>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="px-6 pt-6 pb-4">
                  {order.items && order.items.length > 0 && order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-6 items-start mb-6 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.image_url || 'https://via.placeholder.com/100'}
                        alt={item.productName || 'Product'}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm border"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="text-lg font-semibold text-gray-800 mb-2">
                              {item.productName || 'Product Name'}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">Size: {item.size || 'Standard'}</div>
                            <div className="text-sm text-gray-600 mb-1">Quantity: {item.quantity || 1}</div>
                            <div className="text-sm text-gray-600 mb-3">Price: ₹{item.price?.toFixed(2) || 'N/A'}</div>
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-6 py-2 rounded-full font-semibold shadow transition-colors mt-2">
                              Buy it again
                            </button>
                          </div>
                          <div className="md:text-right mt-4 md:mt-0">
                            <div className="text-xs text-gray-500 mb-1">Delivery Status</div>
                            <div className="text-base text-gray-800 font-medium">
                              {getDeliveryDate(order.createdAt, order.orderStatus)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-semibold text-gray-800">{order.paymentMethod || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Order Status:</span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-600 text-white">
                          {order.orderStatus || 'Processing'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-600 text-white">
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="flex justify-between md:justify-end md:gap-8">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-800">₹{order.subtotal?.toFixed(2) || 'N/A'}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between md:justify-end md:gap-8">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-green-600 font-medium">-₹{order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between md:justify-end md:gap-8">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium text-gray-800">
                          {order.deliveryCharges === 0 ? 'FREE' : `₹${order.deliveryCharges?.toFixed(2) || 'N/A'}`}
                        </span>
                      </div>
                      <div className="flex justify-between md:justify-end md:gap-8 pt-2 border-t border-gray-300 mt-2">
                        <span className="text-lg font-semibold text-gray-800">Total:</span>
                        <span className="text-lg font-bold text-indigo-600">₹{order.totalAmount?.toFixed(2) || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-indigo-500 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm || activeTab !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeTab !== 'all' 
                ? 'Try adjusting your search criteria or filters.' 
                : 'Start shopping to see your orders here.'
              }
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Shopping
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;