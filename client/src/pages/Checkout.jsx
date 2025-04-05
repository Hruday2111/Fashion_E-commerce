import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulated product and price details
    const product = {
        name: "Product Name",
        price: 183,
        quantity: 1
    };

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // Fetch user addresses
                const addressResponse = await fetch('http://localhost:4000/api/user/addresses');
                const addressData = await addressResponse.json();
                setAddresses(addressData);

                // If no addresses found, set loading to false
                if (addressData.length > 0) {
                    setSelectedAddress(addressData[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, []);

    const handlePlaceOrder = async () => {
        try {
            const orderData = {
                userId: "U016", // hardcoded for example
                productId: "P123", // hardcoded for example
                shippingAddress: selectedAddress,
                paymentMethod: "Credit Card", // This would typically come from user selection
                totalAmount: calculateTotalAmount()
            };

            const response = await fetch('http://localhost:4000/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const orderResult = await response.json();
            
            // Navigate to order confirmation or thank you page
            navigate(`/order-confirmation/${orderResult.orderId}`);
        } catch (error) {
            console.error('Order placement error:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    const calculateTotalAmount = () => {
        const price = product.price;
        const platformFee = 3;
        const deliveryCharges = 40;
        return price + platformFee + (deliveryCharges === 0 ? 0 : deliveryCharges);
    };

    if (loading) return <p className="text-center text-gray-500 text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Login */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">1. LOGIN</h2>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Aditya Kumar Prasad</p>
                            <p>+91 9142589701</p>
                        </div>
                        <button className="text-blue-600 font-semibold">CHANGE</button>
                    </div>
                </div>

                {/* Middle Column - Delivery Address */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">2. DELIVERY ADDRESS</h2>
                    {addresses.map((address, index) => (
                        <div 
                            key={index} 
                            className={`p-3 mb-2 border rounded-lg cursor-pointer ${
                                selectedAddress === address 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-300'
                            }`}
                            onClick={() => setSelectedAddress(address)}
                        >
                            <p className="font-semibold">{address.fullName}</p>
                            <p>{address.street}</p>
                            <p>{`${address.city}, ${address.state} - ${address.zipCode}`}</p>
                            <p>Phone: {address.phone}</p>
                        </div>
                    ))}
                    <button className="text-blue-600 font-semibold mt-2">+ Add a new address</button>
                </div>

                {/* Right Column - Price Details */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">PRICE DETAILS</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Price (1 item)</span>
                            <span>₹{product.price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Charges</span>
                            <span className="text-green-600">₹40 FREE</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Platform Fee</span>
                            <span>₹3</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold">
                            <span>Total Payable</span>
                            <span>₹{calculateTotalAmount()}</span>
                        </div>
                        <p className="text-green-600 text-sm">Your Total Savings on this order ₹813</p>
                    </div>
                </div>
            </div>

            {/* Payment and Order Placement */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        className="mr-2" 
                        id="termsAgreement" 
                    />
                    <label htmlFor="termsAgreement" className="text-sm">
                        By continuing with the order, you confirm that you are above 18 years of age, 
                        and you agree to the Flipkart's Terms of Use and Privacy Policy
                    </label>
                </div>
                <button 
                    onClick={handlePlaceOrder}
                    className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;