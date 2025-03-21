import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import './Home.css';

const Home = () => {
    const [winterCollection, setWinter] = useState([]);
    const [summerCollection, setSummer] = useState([]);
    const [accessories, setAccessory] = useState([]);
    const [cartItems, setCartItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchCategory = async (category, count) => {
                    const response = await fetch(
                        `http://localhost:4000/api/product/filteredProducts?query=${category}&count=${count}`
                    );
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${category} products`);
                    }
                    return response.json();
                };

                const [winter, summer, access, cartResponse] = await Promise.all([
                    fetchCategory("winter", 4),
                    fetchCategory("summer", 4),
                    fetchCategory("accessories", 4),
                    fetch('http://localhost:4000/api/cart/')
                ]);
                const cart = await cartResponse.json();

                setWinter(winter);
                setSummer(summer);
                setAccessory(access);
                setCartItem(cart);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (isLoading) {
        return <div className="loading-container flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="error-message text-red-600 p-4">Error: {error}</div>;
    }

    const ProductList = ({ products, title }) => (
        <div className="category-card mb-8">
            <h3 className="category-title text-xl font-bold mb-4">{title}</h3>
            <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((item) => (
                    <div 
                        key={item.id} 
                        className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                        onClick={() => handleProductClick(item.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img 
                            src={item.image_url} 
                            alt={item.productdisplayname}
                            className="product-image w-full h-48 object-cover rounded-md mb-2"
                        />
                        <h4 className="product-name font-medium text-gray-800">{item.productdisplayname}</h4>
                        <p className="product-price text-gray-600">${item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="home-container max-w-7xl mx-auto px-4">
            <section className="hero-section py-12 text-center">
                <div className="hero-content max-w-3xl mx-auto">
                    <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">Upgrade Your Style!</h1>
                    <p className="hero-subtitle text-xl md:text-2xl mb-6 text-gray-600">Discover the latest trends in fashion.</p>
                    <a href="/shop" className="shop-button inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Shop Now</a>
                </div>
            </section>

            <section className="categories-section py-12">
                <h2 className="section-title text-3xl font-bold text-center mb-8">Shop by Category</h2>
                <div className="categories-grid space-y-12">
                    <ProductList products={winterCollection} title="Winter Collection" />
                    <ProductList products={summerCollection} title="Summer Collection" />
                    <ProductList products={accessories} title="Accessories" />
                </div>
            </section>
        </div>
    );
};

export default Home;