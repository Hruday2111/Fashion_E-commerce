import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API_BASE from '../config/api';

const SearchedProducts = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query");

    const count = 50;

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    // Filter states
    const [filters, setFilters] = useState({
        priceRange: [0, 10000],
        mastercategory: [],
        gender: [],
        season: [],
        stock: 'all', // 'all', 'inStock', 'outOfStock'
        minRating: 0
    });

    // Available filter options
    const [filterOptions, setFilterOptions] = useState({
        mastercategories: [],
        genders: [],
        seasons: []
    });

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = async (productId) => {
        try {
            const response = await fetch(`${API_BASE}/api/cart/add/?productId=${productId}`, {
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

    // Extract unique filter options from products
    useEffect(() => {
        if (products.length > 0) {
            const mastercategories = [...new Set(products.map(p => p.mastercategory))].sort();
            const genders = [...new Set(products.map(p => p.gender))].sort();
            const seasons = [...new Set(products.map(p => p.season))].sort();

            setFilterOptions({
                mastercategories,
                genders,
                seasons
            });
        }
    }, [products]);

    // Apply filters
    useEffect(() => {
        let filtered = [...products];

        // Price filter
        filtered = filtered.filter(product => 
            product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
        );

        // Master Category filter
        if (filters.mastercategory.length > 0) {
            filtered = filtered.filter(product => 
                filters.mastercategory.includes(product.mastercategory)
            );
        }

        // Gender filter
        if (filters.gender.length > 0) {
            filtered = filtered.filter(product => 
                filters.gender.includes(product.gender)
            );
        }

        // Season filter
        if (filters.season.length > 0) {
            filtered = filtered.filter(product => 
                filters.season.includes(product.season)
            );
        }

        // Stock filter
        if (filters.stock === 'inStock') {
            filtered = filtered.filter(product => product.stock > 0);
        } else if (filters.stock === 'outOfStock') {
            filtered = filtered.filter(product => product.stock === 0);
        }

        // Rating filter
        if (filters.minRating > 0) {
            filtered = filtered.filter(product => {
                const ratings = product.ratings || {};
                const totalRatings = Object.values(ratings).reduce((sum, count) => sum + count, 0);
                if (totalRatings === 0) return false;
                
                const averageRating = Object.entries(ratings).reduce((sum, [rating, count]) => 
                    sum + (parseInt(rating) * count), 0) / totalRatings;
                
                return averageRating >= filters.minRating;
            });
        }

        setFilteredProducts(filtered);
    }, [products, filters]);

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            if (filterType === 'priceRange') {
                return { ...prev, priceRange: value };
            } else if (filterType === 'stock') {
                return { ...prev, stock: value };
            } else if (filterType === 'minRating') {
                return { ...prev, minRating: value };
            } else {
                // Handle array filters (mastercategory, gender, season)
                const currentArray = prev[filterType];
                const newArray = currentArray.includes(value)
                    ? currentArray.filter(item => item !== value)
                    : [...currentArray, value];
                return { ...prev, [filterType]: newArray };
            }
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            priceRange: [0, 10000],
            mastercategory: [],
            gender: [],
            season: [],
            stock: 'all',
            minRating: 0
        });
    };

    // Get average rating for a product
    const getAverageRating = (product) => {
        const ratings = product.ratings || {};
        const totalRatings = Object.values(ratings).reduce((sum, count) => sum + count, 0);
        if (totalRatings === 0) return 0;
        
        const averageRating = Object.entries(ratings).reduce((sum, [rating, count]) => 
            sum + (parseInt(rating) * count), 0) / totalRatings;
        
        return averageRating;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            if (!searchQuery) return;
            try {
                const response = await fetch(
                    `${API_BASE}/api/product/filteredProducts?query=${encodeURIComponent(searchQuery)}&count=${count}`
                );
                if (!response.ok) throw new Error("Failed to fetch products");

                const data = await response.json();
                console.log('API Response:', data); // Debug log
                if (data.length > 0) {
                    console.log('Sample product:', data[0]); // Debug log
                }
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
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <h2 className="text-3xl font-bold text-indigo-700 mb-4 md:mb-0">
                        Search Results for "{searchQuery}"
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">
                            {filteredProducts.length} of {products.length} products
                        </span>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>₹{filters.priceRange[0]}</span>
                                        <span>₹{filters.priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="100"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="100"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Master Category */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                                <div className="space-y-2">
                                    {filterOptions.mastercategories.map(category => (
                                        <label key={category} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={filters.mastercategory.includes(category)}
                                                onChange={() => handleFilterChange('mastercategory', category)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Gender</h4>
                                <div className="space-y-2">
                                    {filterOptions.genders.map(gender => (
                                        <label key={gender} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={filters.gender.includes(gender)}
                                                onChange={() => handleFilterChange('gender', gender)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{gender}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Season */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Season</h4>
                                <div className="space-y-2">
                                    {filterOptions.seasons.map(season => (
                                        <label key={season} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={filters.season.includes(season)}
                                                onChange={() => handleFilterChange('season', season)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{season}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Stock</h4>
                                <div className="space-y-2">
                                    {[
                                        { value: 'all', label: 'All Items' },
                                        { value: 'inStock', label: 'In Stock' },
                                        { value: 'outOfStock', label: 'Out of Stock' }
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="stock"
                                                value={option.value}
                                                checked={filters.stock === option.value}
                                                onChange={(e) => handleFilterChange('stock', e.target.value)}
                                                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                                <div className="space-y-2">
                                    {[0, 1, 2, 3, 4, 5].map(rating => (
                                        <label key={rating} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={rating}
                                                checked={filters.minRating === rating}
                                                onChange={(e) => handleFilterChange('minRating', parseInt(e.target.value))}
                                                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {rating === 0 ? 'Any Rating' : `${rating}+ Stars`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.productId || product._id}
                                        className="group bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer relative border border-indigo-50"
                                    >
                                        <div className="relative overflow-hidden" onClick={() => handleProductClick(product.productId || product._id)}>
                                            <img
                                                src={product.image_url}
                                                alt={product.productdisplayname}
                                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            
                                            {/* Stock Badge */}
                                            {product.stock === 0 && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                    Out of Stock
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Cart Icon Button */}
                                        <button
                                            className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-full p-2 shadow transition-colors"
                                            title="Add to Cart"
                                            onClick={(e) => { e.stopPropagation(); handleAddToCart(product.productId || product._id); }}
                                            disabled={product.stock === 0}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </button>
                                        
                                        <div className="p-4" onClick={() => handleProductClick(product.productId || product._id)}>
                                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 h-12 mb-2">
                                                {product.productdisplayname}
                                            </h3>
                                            
                                            {/* Rating */}
                                            <div className="flex items-center mb-2">
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => {
                                                        const avgRating = getAverageRating(product);
                                                        return (
                                                            <svg
                                                                key={star}
                                                                className={`w-4 h-4 ${
                                                                    star <= avgRating ? 'text-yellow-400' : 'text-gray-300'
                                                                }`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        );
                                                    })}
                                                </div>
                                                <span className="ml-1 text-sm text-gray-600">
                                                    ({getAverageRating(product).toFixed(1)})
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <p className="text-lg font-bold text-indigo-600">₹{product.price}</p>
                                                <p className="text-sm text-gray-500">
                                                    Stock: {product.stock}
                                                </p>
                                            </div>
                                            
                                            {/* Product Details */}
                                            <div className="mt-2 text-xs text-gray-500 space-y-1">
                                                <p>Category: {product.mastercategory}</p>
                                                <p>Gender: {product.gender}</p>
                                                <p>Season: {product.season}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <div className="text-indigo-500 text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your filters or search criteria.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchedProducts;
