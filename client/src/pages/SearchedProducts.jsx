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

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Search Results for "{searchQuery}"</h2>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="p-4 border rounded-lg shadow-lg" onClick={() => handleProductClick(product.id)}
                        style={{ cursor: 'pointer' }}>
                        <img src={product.image_url} alt={product.productdisplayname} className="w-full h-40 object-cover rounded-md" />
                        <h3 className="text-lg font-semibold mt-2">{product.productdisplayname}</h3>
                        <p className="text-green-600 font-semibold">₹{product.price}</p>
                        {/* <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">View Details</button> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchedProducts;
