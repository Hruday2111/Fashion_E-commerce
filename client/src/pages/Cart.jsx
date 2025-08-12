import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE from '../config/api';

const Cart = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    // Check if redirected from 'buy now'
    const isDirectCheckout = new URLSearchParams(location.search).get('checkout') === 'true';

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                // Use the correct endpoint as per your cartRoute
                const response = await fetch(`${API_BASE}/api/cart/`, {
                    credentials: 'include' // Important for sending cookies/auth tokens
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("User not authenticated");
                    }
                    throw new Error("Failed to fetch cart items");
                }

                const data = await response.json();
                
                // Handle the empty cart message from the controller
                if (data.message === "Your cart is empty") {
                    setCartItems([]);
                } else {
                    // Add quantity property to each item for UI functionality
                    const itemsWithQuantity = data.map(item => ({
                        ...item,
                        quantity: 1 // Default quantity since your model doesn't track quantity
                    }));
                    setCartItems(itemsWithQuantity);
                    calculateTotal(itemsWithQuantity);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
    };

    const handleQuantityChange = (productId, change) => {
        // Since backend doesn't track quantity, we only update it locally for UI
        const updatedItems = cartItems.map(item => {
            if (item.productId === productId) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const handleRemoveItem = async (productId) => {
        try {
            // Use the delete endpoint from cartRoute
            const response = await fetch(`${API_BASE}/api/cart/delete?productId=${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Failed to remove item from cart");
            }

            // Remove the item from local state
            const updatedItems = cartItems.filter(item => item.productId !== productId);
            setCartItems(updatedItems);
            calculateTotal(updatedItems);
            
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePlaceOrder = () => {
        navigate('/checkout_cart');
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your cart...</p>
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

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-4">
                    <div className="text-indigo-500 text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <button 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
                        onClick={handleContinueShopping}
                    >
                        Continue Shopping
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
                    <h2 className="text-2xl font-semibold text-gray-700">Shopping Cart</h2>
                    <p className="text-gray-500 mt-1">You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Cart Items</h3>
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item.productId} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                        {/* Product Image */}
                                        <img 
                                            src={item.image_url} 
                                            alt={item.productdisplayname}
                                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                                        />
                                        
                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-lg font-semibold text-gray-800">{item.productdisplayname}</h4>
                                                <p className="font-bold text-indigo-600 text-lg">₹{item.price}</p>
                                            </div>
                                            
                                            <p className="text-sm text-gray-600 mb-3">Size: {item.size}</p>
                                            
                                            {/* Quantity Control */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <span className="mr-3 text-sm font-medium text-gray-700">Quantity:</span>
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button 
                                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-l-lg"
                                                            onClick={() => handleQuantityChange(item.productId, -1)}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-4 py-1 border-x border-gray-300 bg-white">{item.quantity}</span>
                                                        <button 
                                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-r-lg"
                                                            onClick={() => handleQuantityChange(item.productId, 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <button 
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                                                    onClick={() => handleRemoveItem(item.productId)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Price Details</h3>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Price ({cartItems.length} items)</span>
                                    <span className="font-medium">₹{totalPrice}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="text-green-600 font-medium">- ₹{Math.round(totalPrice * 0.1)}</span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Charges</span>
                                    <span className={totalPrice > 1000 ? "text-green-600 font-medium" : "font-medium"}>
                                        {totalPrice > 1000 ? 'FREE' : '₹40'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total Amount</span>
                                    <span className="text-indigo-600">₹{Math.round(totalPrice * 0.9) + (totalPrice > 1000 ? 0 : 40)}</span>
                                </div>
                                <p className="text-green-600 text-sm mt-2">You will save ₹{Math.round(totalPrice * 0.1)} on this order</p>
                            </div>
                            
                            {/* Delivery Address */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <h4 className="font-semibold text-gray-800 mb-2">Deliver to:</h4>
                                <p className="text-gray-600 text-sm">123 Main Street, Indore - 452020</p>
                                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 transition-colors">
                                    Change Address
                                </button>
                            </div>
                            
                            {/* Checkout Buttons */}
                            <div className="space-y-3">
                                <button 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg text-lg"
                                    onClick={handlePlaceOrder}
                                >
                                    {isDirectCheckout ? 'Proceed to Payment' : 'Place Order'}
                                </button>
                                
                                <button 
                                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg text-lg"
                                    onClick={handleContinueShopping}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;