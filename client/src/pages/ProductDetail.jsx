import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/product/getProductById?query=${id}`);
                if (!response.ok) throw new Error("Failed to fetch product");

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleCartClick = async () => {
        try {
            // Send POST request to add item to cart
            const response = await fetch(`http://localhost:4000/api/cart/add/?productId=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // Important for sending cookies/auth tokens
            });
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }
        
            // Optional: Show success message
            alert('Item added to cart successfully!');
            
            // Navigate to cart page
            navigate('/cart');
        } catch (error) {
            console.error('Error adding item to cart:', error);
            // alert('Failed to add item to cart. Please try again.');
        }
    };


    if (loading) return <p className="text-center text-gray-500 text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-6">
            {/* Image + Product Info (Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left - Product Image */}
                <div>
                    <img
                        src={product.image_url}
                        alt={product.productdisplayname}
                        className="w-full h-auto rounded-lg shadow-md"
                    />
                </div>

                {/* Right - Product Info */}
                <div className="flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-800">{product.productdisplayname}</h2>
                    <p className="text-xl font-semibold text-green-600 mt-2">Price: ₹{product.price}</p>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-4">
                        <button 
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
                            onClick={() => handleCartClick()}
                            style={{ cursor: 'pointer' }}>
                            Add to Cart
                        </button>
                        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Sizes & Offers Section */}
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Sizes:</h3>
                        <div className="flex gap-2 mt-2">
                            {["S", "M", "L", "XL"].map((size) => (
                                <span key={size} className="border px-3 py-1 rounded-md shadow-sm cursor-pointer hover:bg-gray-100">{size}</span>
                            ))}
                        </div>

                        <h3 className="text-lg font-semibold mt-4">Offers:</h3>
                        <p className="text-sm text-gray-700">Flat 10% off on first order!</p>
                    </div>
                </div>
            </div>

            {/* Product Details Section */}
            <div className="mt-6 p-6 rounded-lg shadow-md bg-white">
                <h3 className="text-2xl font-bold">Product Details</h3>
                <p className="text-gray-700"><b>Category:</b> {product.mastercategory} - {product.subcategory}</p>
                <p className="text-gray-700"><b>Type:</b> {product.articletype}</p>
                <p className="text-gray-700"><b>Color:</b> {product.basecolour}</p>
                <p className="text-gray-700"><b>Gender:</b> {product.gender}</p>
                <p className="text-gray-700"><b>Usage:</b> {product.usage}</p>
                <p className="text-gray-700"><b>Season:</b> {product.season}</p>
            </div>

            {/* Delivery Section */}
            <div className="mt-6 p-6 rounded-lg shadow-md bg-white">
                <h3 className="text-2xl font-bold">Delivery Information</h3>
                <p className="text-gray-700">Estimated Delivery: 3-5 Business Days</p>
                <p className="text-gray-700">Free Shipping on orders above ₹1000</p>
            </div>

            {/* Related Products Section */}
            <div className="mt-6 p-6 rounded-lg shadow-md bg-white">
                <h3 className="text-2xl font-bold">Related Products</h3>
                <p className="text-gray-700">Check out similar items that you might like.</p>
            </div>
        </div>
    );
};

export default ProductDetails;
