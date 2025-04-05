import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
                const response = await fetch('http://localhost:4000/api/cart/', {
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
            const response = await fetch(`http://localhost:4000/api/cart/delete?productId=${productId}`, {
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

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    const handleAddToCart = async (productId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/cart/add?productId=${productId}`, {
                method: 'POST',
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error("Failed to add item to cart");
            }
            
            // Refresh cart items
            const refreshResponse = await fetch('http://localhost:4000/api/cart/', {
                credentials: 'include'
            });
            
            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                if (Array.isArray(data)) {
                    const itemsWithQuantity = data.map(item => ({
                        ...item,
                        quantity: 1
                    }));
                    setCartItems(itemsWithQuantity);
                    calculateTotal(itemsWithQuantity);
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p className="text-center text-gray-500 text-lg">Loading your cart...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>;
    if (cartItems.length === 0) {
        return (
            <div className="max-w-5xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition shadow-md"
                    onClick={handleContinueShopping}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h2>
            
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {cartItems.map((item) => (
                    <div key={item.productId} className="flex py-4 border-b last:border-b-0">
                        {/* Product Image */}
                        <img 
                            src={item.image_url} 
                            alt={item.productdisplayname}
                            className="w-24 h-24 object-cover rounded-md shadow-sm"
                        />
                        
                        {/* Product Details */}
                        <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                                <h3 className="text-lg font-semibold">{item.productdisplayname}</h3>
                                <p className="font-bold">₹{item.price}</p>
                            </div>
                            
                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                            
                            {/* Quantity Control */}
                            <div className="flex items-center mt-2">
                                <span className="mr-2 text-sm">Quantity:</span>
                                <button 
                                    className="border rounded-l px-2 py-1 bg-gray-100 hover:bg-gray-200"
                                    onClick={() => handleQuantityChange(item.productId, -1)}
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                                <button 
                                    className="border rounded-r px-2 py-1 bg-gray-100 hover:bg-gray-200"
                                    onClick={() => handleQuantityChange(item.productId, 1)}
                                >
                                    +
                                </button>
                                
                                <button 
                                    className="ml-4 text-red-500 hover:text-red-700 text-sm"
                                    onClick={() => handleRemoveItem(item.productId)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Price Details</h3>
                
                <div className="flex justify-between mb-2">
                    <span>Price ({cartItems.length} items)</span>
                    <span>₹{totalPrice}</span>
                </div>
                
                <div className="flex justify-between mb-2">
                    <span>Discount</span>
                    <span className="text-green-600">- ₹{Math.round(totalPrice * 0.1)}</span>
                </div>
                
                <div className="flex justify-between mb-2">
                    <span>Delivery Charges</span>
                    <span>{totalPrice > 1000 ? <span className="text-green-600">FREE</span> : '₹40'}</span>
                </div>
                
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>₹{Math.round(totalPrice * 0.9) + (totalPrice > 1000 ? 0 : 40)}</span>
                </div>
                
                <p className="text-green-600 text-sm mt-2">You will save ₹{Math.round(totalPrice * 0.1)} on this order</p>
            </div>
            
            {/* Delivery Address (simplified) */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Deliver to:</h3>
                <p className="text-gray-700">123 Main Street, Indore - 452020</p>
                <button className="text-blue-500 hover:text-blue-700 text-sm mt-2">Change</button>
            </div>
            
            {/* Checkout Button */}
            <div className="flex gap-4">
                <button 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md flex-1"
                    onClick={handleCheckout}
                >
                    {isDirectCheckout ? 'Proceed to Payment' : 'Place Order'}
                </button>
                
                <button 
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md"
                    onClick={handleContinueShopping}
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default Cart;