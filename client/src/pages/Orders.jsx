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

  const handleSearch = () => {
    // Search is handled by filteredOrders
  };

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
      case 'Processing': return 'text-yellow-600';
      case 'Shipped': return 'text-blue-600';
      case 'Delivered': return 'text-green-600';
      case 'Cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600';
      case 'Pending': return 'text-yellow-600';
      case 'Failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 text-lg">Loading your orders...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search all orders"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <button 
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Search Orders
          </button>
        </div>
      </div>
      
      <div className="flex border-b mb-4">
        <button 
          onClick={() => setActiveTab('all')}
          className={`py-2 px-4 ${activeTab === 'all' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('buy-again')}
          className={`py-2 px-4 ${activeTab === 'buy-again' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
        >
          Buy Again
        </button>
        <button 
          onClick={() => setActiveTab('not-shipped')}
          className={`py-2 px-4 ${activeTab === 'not-shipped' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
        >
          Not Yet Shipped
        </button>
        <button 
          onClick={() => setActiveTab('cancelled')}
          className={`py-2 px-4 ${activeTab === 'cancelled' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
        >
          Cancelled Orders
        </button>
      </div>

      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex justify-between bg-gray-100 p-2 rounded-t-lg">
              <div className="flex space-x-8">
                <div>
                  <p className="text-sm text-gray-500">ORDER PLACED</p>
                  <p>{new Date(order.createdAt).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">TOTAL</p>
                  <p>₹{order.totalAmount?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">SHIP TO</p>
                  <p className='font-bold text-blue-500'>
                    {order.shippingAddress?.fullName || 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">ORDER # {order.orderId}</p>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="flex p-4 border-b last:border-b-0">
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg">
                        {getDeliveryDate(order.createdAt, order.orderStatus)}
                      </h3>
                      <div className="flex mt-2">
                        <img
                          src={item.image_url || 'https://via.placeholder.com/100'}
                          alt={item.productName || 'Product'}
                          className="w-20 h-20 object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100';
                          }}
                        />
                        <div className="ml-4">
                          <Link 
                            to={`/product/${item.productId}`} 
                            className="text-blue-500 hover:underline"
                          >
                            {item.productName || 'Product Name'}
                          </Link>
                          <p className="text-gray-600 text-sm">Size: {item.size || 'Standard'}</p>
                          <p className="text-gray-600 text-sm">Quantity: {item.quantity || 1}</p>
                          <p className="text-gray-600 text-sm">Price: ₹{item.price?.toFixed(2) || 'N/A'}</p>
                          <div className="mt-2">
                            <button className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm shadow-md hover:bg-yellow-500">
                              Buy it again
                            </button>
                            <button className="bg-gray-200 text-black px-4 py-1 rounded-full ml-2 text-sm hover:bg-gray-300">
                              View your item
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button className="border rounded-lg px-4 py-2 w-48 text-sm hover:bg-gray-50">
                        Track package
                      </button>
                      <button className="border rounded-lg px-4 py-2 w-48 text-sm hover:bg-gray-50">
                        Return or replace items
                      </button>
                      <button className="border rounded-lg px-4 py-2 w-48 text-sm hover:bg-gray-50">
                        Leave seller feedback
                      </button>
                      <button className="border rounded-lg px-4 py-2 w-48 text-sm hover:bg-gray-50">
                        Leave delivery feedback
                      </button>
                      <button className="border rounded-lg px-4 py-2 w-48 text-sm hover:bg-gray-50">
                        Write a product review
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No items found in this order
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    Payment Method: {order.paymentMethod || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Order Status: <span className={`font-semibold ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus || 'Processing'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment Status: <span className={`font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Subtotal: ₹{order.subtotal?.toFixed(2) || 'N/A'}
                  </p>
                  {order.discount > 0 && (
                    <p className="text-sm text-green-600">
                      Discount: -₹{order.discount.toFixed(2)}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Delivery: {order.deliveryCharges === 0 ? 'FREE' : `₹${order.deliveryCharges?.toFixed(2) || 'N/A'}`}
                  </p>
                  <p className="font-semibold">
                    Total: ₹{order.totalAmount?.toFixed(2) || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || activeTab !== 'all' ? 'No orders match your criteria.' : 'You have no orders yet.'}
          </p>
          <Link to="/" className="text-blue-600 hover:underline">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;