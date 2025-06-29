import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SearchedProducts = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query");

    const count = 50;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = async (productId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/cart/add/?productId=${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }
            navigate('/cart');
        } catch (error) {
            alert('Please log in to add items to your cart.');
            navigate('/login');
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            if (!searchQuery) return;
            try {
                const response = await fetch(
                    `http://localhost:4000/api/product/filteredProducts?query=${encodeURIComponent(searchQuery)}&count=${count}`
                );
                if (!response.ok) throw new Error("Failed to fetch products");

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts(); 
    }, [searchQuery]);

    if (loading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading search results...</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-4">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <p className="text-red-500 text-lg mb-4">Error: {error}</p>
                <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">Try Again</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Search Results for "{searchQuery}"</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.productId || product._id}
                            className="group bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer relative border border-indigo-50"
                        >
                            <div className="relative overflow-hidden" onClick={() => handleProductClick(product.productId || product._id)}>
                                <img
                                    src={product.image_url}
                                    alt={product.productdisplayname}
                                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            {/* Cart Icon Button */}
                            <button
                                className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-full p-2 shadow transition-colors"
                                title="Add to Cart"
                                onClick={(e) => { e.stopPropagation(); handleAddToCart(product.productId || product._id); }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </button>
                            <div className="p-4" onClick={() => handleProductClick(product.productId || product._id)}>
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 h-12 mb-2">{product.productdisplayname}</h3>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-bold text-indigo-600">₹{product.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchedProducts;
