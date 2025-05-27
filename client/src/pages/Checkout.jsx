
// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Checkout() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Check if id exists before making API call
//     if (!id) {
//       setError("Product ID is missing");
//       setLoading(false);
//       return;
//     }

//     console.log("Checkout ID:", id);

//     const fetchProduct = async () => {
//       try {
//         const res = await fetch(`http://localhost:4000/api/product/getProductById?query=${id}`);
//         if (!res.ok) throw new Error("Failed to fetch product");
        
//         const data = await res.json();
//         setProduct(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleQuantityChange = (delta) => {
//     setQuantity((prev) => Math.max(1, prev + delta));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle checkout logic here
//     alert('Order placed successfully!');
//     navigate('/');
//   };

//   // Handle missing ID case
//   if (!id) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6 md:p-12">
//         <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
//           <p className="text-center text-red-500 text-lg">Product ID is missing. Please navigate from a valid product.</p>
//           <button
//             onClick={() => navigate('/')}
//             className="mt-4 block mx-auto text-blue-600 hover:underline"
//           >
//             ← Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) return <div className="text-center mt-10">Loading product...</div>;
//   if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
//   if (!product) return <div className="text-center mt-10">Product not found</div>;

//   const totalPrice = product.price * quantity;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-12">
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg grid md:grid-cols-3 gap-8 p-6">
//         {/* Product & Cart Section */}
//         <div className="md:col-span-2">
//           <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

//           <div className="flex items-center justify-between border-b pb-4 mb-4">
//             <div className="flex items-center gap-4">
//               <img
//                 src={product.image_url || 'https://via.placeholder.com/100'}
//                 alt={product.productdisplayname}
//                 className="w-20 h-20 rounded-md object-cover"
//               />
//               <div>
//                 <h4 className="font-semibold">{product.productdisplayname}</h4>
//                 <p className="text-gray-500 text-sm">Category: {product.mastercategory}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <button
//                 className="bg-gray-200 px-2 rounded"
//                 onClick={() => handleQuantityChange(-1)}
//               >
//                 -
//               </button>
//               <span>{quantity}</span>
//               <button
//                 className="bg-gray-200 px-2 rounded"
//                 onClick={() => handleQuantityChange(1)}
//               >
//                 +
//               </button>
//             </div>

//             <p className="font-medium text-right">₹{totalPrice.toFixed(2)}</p>
//           </div>

//           <div className="flex justify-between mt-6 text-lg">
//             <span className="text-gray-600">Subtotal</span>
//             <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between text-lg">
//             <span className="text-gray-600">Shipping</span>
//             <span className="font-semibold">Free</span>
//           </div>

//           <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t">
//             <span>Total</span>
//             <span>₹{totalPrice.toFixed(2)}</span>
//           </div>

//           <button
//             onClick={() => navigate('/')}
//             className="mt-6 inline-block text-blue-600 hover:underline"
//           >
//             ← Continue Shopping
//           </button>
//         </div>

//         {/* Payment Info */}
//         <div className="bg-gray-200 p-6 rounded-lg">
//           <h2 className="text-2xl font-bold mb-6">Payment Info.</h2>

//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <label className="block text-black mb-1">Payment Method</label>
//               <div className="flex items-center gap-4">
//                 <label className="flex items-center gap-2">
//                   <input type="radio" name="method" defaultChecked /> Credit Card
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input type="radio" name="method" /> PayPal
//                 </label>
//               </div>
//             </div>

//             <div>
//               <label className="block  text-black mb-1">Name on Card</label>
//               <input
//                 type="text"
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="John Carter"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block  text-black mb-1">Card Number</label>
//               <input
//                 type="text"
//                 className="w-full border rounded px-3 py-2"
//                 placeholder="1234 5678 9012 3456"
//                 required
//               />
//             </div>

//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <label className="block  text-black mb-1">Expiration Date</label>
//                 <input
//                   type="text"
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="MM/YY"
//                   required
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="block  text-black mb-1">CVV</label>
//                 <input
//                   type="text"
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="123"
//                   required
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//             >
//               Check Out
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/cart/', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("User not authenticated");
          }
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        
        if (data.message === "Your cart is empty") {
          setCartItems([]);
        } else {
          // Add quantity property to each item (same as in Cart component)
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
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = Math.round(subtotal * 0.1);
    const deliveryCharges = subtotal > 1000 ? 0 : 40;
    const total = subtotal - discount + deliveryCharges;
    setTotalPrice(total);
  };

  const handleQuantityChange = (productId, delta) => {
    const updatedItems = cartItems.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle checkout logic here
    alert('Order placed successfully!');
    navigate('/');
  };

  if (loading) return <div className="text-center mt-10">Loading cart items...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-12">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <p className="text-center text-gray-500 text-lg">Your cart is empty. Please add items to proceed with checkout.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 block mx-auto text-blue-600 hover:underline"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = Math.round(subtotal * 0.1);
  const deliveryCharges = subtotal > 1000 ? 0 : 40;
  const finalTotal = subtotal - discount + deliveryCharges;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg grid md:grid-cols-3 gap-8 p-6">
        {/* Product & Cart Section */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/100'}
                    alt={item.productdisplayname}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{item.productdisplayname}</h4>
                    <p className="text-gray-500 text-sm">Size: {item.size}</p>
                    <p className="text-gray-500 text-sm">₹{item.price} each</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    onClick={() => handleQuantityChange(item.productId, -1)}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    onClick={() => handleQuantityChange(item.productId, 1)}
                  >
                    +
                  </button>
                </div>

                <p className="font-medium text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Discount</span>
              <span className="font-semibold text-green-600">-₹{discount}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Delivery Charges</span>
              <span className="font-semibold">
                {deliveryCharges === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `₹${deliveryCharges}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <p className="text-green-600 text-sm">You will save ₹{discount} on this order</p>
            )}
          </div>

          <button
            onClick={() => navigate('/cart')}
            className="mt-6 inline-block text-blue-600 hover:underline"
          >
            ← Back to Cart
          </button>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-200 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Payment Info</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-black mb-1">Payment Method</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="method" defaultChecked /> Credit Card
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="method" /> PayPal
                </label>
              </div>
            </div>

            <div>
              <label className="block text-black mb-1">Name on Card</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="John Carter"
                required
              />
            </div>

            <div>
              <label className="block text-black mb-1">Card Number</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Expiration Date</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-black mb-1">CVV</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Delivery Address:</h3>
              <p className="text-gray-700 text-sm">123 Main Street, Indore - 452020</p>
              <button type="button" className="text-blue-600 hover:underline text-sm mt-1">
                Change Address
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Place Order - ₹{finalTotal.toFixed(2)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
