import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
    const { isLoggedIn } = useAuth();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [similar, setsimilar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // Review state
    const [reviewUser, setReviewUser] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Check if id exists before making API call
        if (!id) {
            setError("Product ID is missing");
            setLoading(false);
            return;
        }

        console.log("Product ID:", id);

        const fetchProduct = async () => {
            try {
                const response1 = await fetch(`http://localhost:4000/api/product/getProductById?query=${id}`);
                if (!response1.ok) throw new Error("Failed to fetch product");
                const data1 = await response1.json();
                setProduct(data1);

                console.log("Fetched Product:", data1);
                // Fetch similar products based on the article type
                // Combine article type and gender as separate query parameters for req.query backend
                const queryParams = new URLSearchParams({
                    query: `${data1.articletype} ${data1.gender}`,
                    count: 10
                }).toString();
                
                const response2 = await fetch(
                    `http://localhost:4000/api/product/filteredProducts?${queryParams}`
                );
                if (!response2.ok) throw new Error("Failed to fetch product");
                const data2 = await response2.json();
                setsimilar(data2);

                console.log("Fetched Similar Products:", data2);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Helper functions for ratings
    function getTotalRatings(ratings) {
        return Object.values(ratings || {}).reduce((a, b) => a + b, 0);
    }
    function calculateAverage(ratings) {
        const total = getTotalRatings(ratings);
        if (total === 0) return 0;
        return (
            Object.entries(ratings || {}).reduce(
                (acc, [star, count]) => acc + Number(star) * count,
                0
            ) / total
        );
    }

    // Review submit handler
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`http://localhost:4000/api/product/review?query=${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: reviewUser,
                    rating: reviewRating,
                    comment: reviewComment,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Review submitted successfully!");
                setReviewUser("");
                setReviewRating(0);
                setReviewComment("");
                window.location.reload();
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) {
            alert("Error submitting review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCartClickWrapper = () => {
        if (isLoggedIn) {
            handleCartClick();
        } else {
            alert('Please log in to add items to your cart.');
            navigate('/login');
        }
    };

    const handleBuyNowClickWrapper = () => {
        if (isLoggedIn) {
            handleBuyNowClick();
        } else {
            alert('Please log in to proceed further.');
            navigate('/login');
        }
    };

    const handleCartClick = async () => {
        if (!id) {
            alert('Product ID is missing');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/cart/add/?productId=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            alert('Item added to cart successfully!');
            navigate('/cart');
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        }
    };

    const handleBuyNowClick = async () => {
        if (!id) {
            alert('Product ID is missing');
            return;
        }
        navigate(`/buynow/${id}`);
    }

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    }

    // Handle missing ID case
    if (!id) {
        return (
            <div className="max-w-5xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-6">
                <p className="text-center text-red-500 text-lg">Product ID is missing. Please navigate from a valid product link.</p>
            </div>
        );
    }

    if (loading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading product details...</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-4">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <p className="text-red-500 text-lg mb-4">Error: {error}</p>
                <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">← Back to Home</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                {/* Product Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl shadow-2xl">
                    <img
                        src={product.image_url}
                        alt={product.productdisplayname}
                        className="w-full h-[400px] object-cover rounded-2xl shadow-lg border border-indigo-100"
                    />
                    <div className="flex flex-col justify-between">
                        <div>
                            <h2 className="text-4xl font-extrabold text-indigo-700 mb-2">{product.productdisplayname}</h2>
                            <p className="text-2xl font-bold text-green-600 mb-4">₹{product.price}</p>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2 text-gray-700">Sizes</h3>
                                <div className="flex gap-3">
                                    {["S", "M", "L", "XL"].map((size) => (
                                        <span key={size} className="border px-4 py-1 rounded-full text-sm shadow cursor-pointer hover:bg-indigo-50 transition-colors">
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-1 text-gray-700">Offers</h3>
                                <p className="text-sm text-indigo-600 font-medium">🎉 Flat 10% off on first order!</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button
                                onClick={handleCartClickWrapper}
                                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition shadow-lg text-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNowClickWrapper}
                                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-xl transition shadow-lg text-lg"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="mt-10 bg-white p-8 rounded-3xl shadow-xl">
                    <h3 className="text-2xl font-bold mb-4 text-indigo-700">Product Details</h3>
                    <ul className="text-gray-700 space-y-2 text-base">
                        <li><b>Category:</b> {product.mastercategory} - {product.subcategory}</li>
                        <li><b>Type:</b> {product.articletype}</li>
                        <li><b>Color:</b> {product.basecolour}</li>
                        <li><b>Gender:</b> {product.gender}</li>
                        <li><b>Usage:</b> {product.usage}</li>
                        <li><b>Season:</b> {product.season}</li>
                    </ul>
                </div>

                {/* Customer Reviews Section */}
                <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Customer Reviews</h3>
                    {/* Ratings Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
                                <span>★</span> {calculateAverage(product.ratings).toFixed(1)} <span className="text-gray-700 text-lg font-normal">out of 5</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                                {getTotalRatings(product.ratings)} global ratings
                            </div>
                            {/* Star Rating Bars */}
                            {[5, 4, 3, 2, 1].map((star) => {
                                const total = getTotalRatings(product.ratings);
                                const count = product.ratings?.[star] || 0;
                                const percent = total > 0 ? (count / total) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2 text-sm mt-1">
                                        <span className="w-10">{star} star</span>
                                        <div className="flex-1 h-2 bg-gray-200 rounded">
                                            <div
                                                className="h-2 bg-yellow-400 rounded"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <span className="w-12 text-right">{percent.toFixed(0)}%</span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Reviews List */}
                        <div className="md:col-span-2">
                            {product.reviews?.length > 0 ? (
                                <div className="space-y-4">
                                    {product.reviews.map((review, index) => (
                                        <div key={index} className="border p-4 rounded-lg shadow-sm flex flex-col gap-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold text-gray-800">{review.user}</p>
                                                <span className="text-yellow-500 text-sm">
                                                    {"★".repeat(review.rating)}
                                                    {"☆".repeat(5 - review.rating)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{new Date(review.date).toLocaleDateString()}</p>
                                            <p className="mt-1 text-gray-800">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No reviews yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Write a Review */}
                <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        {/* User Name */}
                        <input
                            type="text"
                            value={reviewUser}
                            onChange={(e) => setReviewUser(e.target.value)}
                            placeholder="Your name"
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        {/* Star Rating */}
                        <div className="flex items-center gap-1">
                            <label className="text-gray-700 font-medium">Rating:</label>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setReviewRating(star)}
                                    className={`cursor-pointer text-2xl ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        {/* Comment */}
                        <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Write your review..."
                            required
                            rows={4}
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-60"
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                </div>

                {/* Delivery Info */}
                <div className="mt-8 bg-gradient-to-r from-blue-100 to-indigo-100 p-8 rounded-3xl shadow-xl">
                    <h3 className="text-2xl font-bold mb-2 text-indigo-700">Delivery Information</h3>
                    <p className="text-gray-700">📦 Estimated Delivery: 3-5 Business Days</p>
                    <p className="text-gray-700">🚚 Free Shipping on orders above ₹1000</p>
                </div>

                {/* Related Products */}
                <div className="mt-10 bg-white p-8 rounded-3xl shadow-xl">
                    <h3 className="text-2xl font-bold mb-2 text-indigo-700">Related Products</h3>
                    <p className="text-gray-600 mb-4">Check out similar items that you might like.</p>
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-6 w-max transition-all duration-300 ease-in-out">
                            {similar && similar.map((product, index) => (
                                <div
                                    key={product.productId || product._id || index}
                                    onClick={() => handleProductClick(product.productId || product._id)}
                                    className="min-w-[200px] max-w-[200px] cursor-pointer rounded-lg p-4 shadow-sm hover:shadow-md transition group bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 cursor-pointer"
                                >
                                    <img
                                        src={product.image_url}
                                        alt={product.productdisplayname}
                                        className="w-full h-48 object-cover rounded-md mb-3 group-hover:scale-105 transition"
                                    />
                                    <h4 className="text-md font-semibold text-gray-800 truncate">{product.productdisplayname}</h4>
                                    <p className="text-sm text-green-600">₹{product.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductDetails;