
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BuyNow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if id exists before making API call
    if (!id) {
      setError("Product ID is missing");
      setLoading(false);
      return;
    }

    console.log("Checkout ID:", id);

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/product/getProductById?query=${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle checkout logic here
    
    alert('Order placed successfully!');
    navigate('/');
  };

  // Handle missing ID case
  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-12">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <p className="text-center text-red-500 text-lg">Product ID is missing. Please navigate from a valid product.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 block mx-auto text-blue-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center mt-10">Loading product...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center mt-10">Product not found</div>;

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg grid md:grid-cols-3 gap-8 p-6">
        {/* Product & Cart Section */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div className="flex items-center gap-4">
              <img
                src={product.image_url || 'https://via.placeholder.com/100'}
                alt={product.productdisplayname}
                className="w-20 h-20 rounded-md object-cover"
              />
              <div>
                <h4 className="font-semibold">{product.productdisplayname}</h4>
                <p className="text-gray-500 text-sm">Category: {product.mastercategory}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="bg-gray-200 px-2 rounded"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="bg-gray-200 px-2 rounded"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>

            <p className="font-medium text-right">₹{totalPrice.toFixed(2)}</p>
          </div>

          <div className="flex justify-between mt-6 text-lg">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Shipping</span>
            <span className="font-semibold">Free</span>
          </div>

          <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-block text-blue-600 hover:underline"
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-200 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Payment Info.</h2>

          <form className="space-y-4">
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
              <label className="block  text-black mb-1">Name on Card</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="John Carter"
                required
              />
            </div>

            <div>
              <label className="block  text-black mb-1">Card Number</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block  text-black mb-1">Expiration Date</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block  text-black mb-1">CVV</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Check Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

