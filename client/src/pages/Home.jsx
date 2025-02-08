import { useEffect, useState } from "react";
// import './Home.css';

const Home = () => {
    const [winterCollection, setWinter] = useState([]);
    const [summerCollection, setSummer] = useState([]);
    const [accessories, setAccessory] = useState([]);
    const [cartItems, setCartItem] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (isLoading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    const ProductList = ({ products, title }) => (
        <div className="category-card">
            <h3 className="category-title">{title}</h3>
            <div className="product-grid">
                {products.map((item) => (
                    <div key={item.id} className="product-card">
                        <img 
                            src={item.image_url} 
                            alt={item.productdisplayname}
                            className="product-image" 
                        />
                        <h4 className="product-name">{item.productdisplayname}</h4>
                        <p className="product-price">${item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Upgrade Your Style!</h1>
                    <p className="hero-subtitle">Discover the latest trends in fashion.</p>
                    <a href="/shop" className="shop-button">Shop Now</a>
                </div>
            </section>

            <section className="categories-section">
                <h2 className="section-title">Shop by Category</h2>
                <div className="categories-grid">
                    <ProductList products={winterCollection} title="Winter Collection" />
                    <ProductList products={summerCollection} title="Summer Collection" />
                    <ProductList products={accessories} title="Accessories" />
                </div>
            </section>
        </div>
    );
};

export default Home;