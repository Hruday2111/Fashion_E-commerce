// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import './Home.css';

// const Home = () => {
//     const [winterCollection, setWinter] = useState([]);
//     const [summerCollection, setSummer] = useState([]);
//     const [accessories, setAccessory] = useState([]);
//     const [cartItems, setCartItem] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchProducts = async () => {
//             setIsLoading(true);
//             setError(null);
//             try {
//                 const fetchCategory = async (category, count) => {
//                     const response = await fetch(
//                         `http://localhost:4000/api/product/filteredProducts?query=${category}&count=${count}`
//                     );
//                     if (!response.ok) {
//                         throw new Error(`Failed to fetch ${category} products`);
//                     }
//                     return response.json();
//                 };

//                 const [winter, summer, access, cartResponse] = await Promise.all([
//                     fetchCategory("winter", 4),
//                     fetchCategory("summer", 4),
//                     fetchCategory("accessories", 4),
//                     fetch('http://localhost:4000/api/cart/')
//                 ]);
//                 const cart = await cartResponse.json();

//                 setWinter(winter);
//                 setSummer(summer);
//                 setAccessory(access);
//                 setCartItem(cart);
//             } catch (err) {
//                 setError(err.message);
//                 console.error('Error fetching data:', err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchProducts();
//     }, []);

//     const handleProductClick = (productId) => {
//         navigate(`/product/${productId}`);
//     };

//     if (isLoading) {
//         return <div className="loading-container flex items-center justify-center min-h-screen">Loading...</div>;
//     }

//     if (error) {
//         return <div className="error-message text-red-600 p-4">Error: {error}</div>;
//     }

//     const ProductList = ({ products, title }) => (
//         <div className="category-card mb-8">
//             <h3 className="category-title text-xl font-bold mb-4">{title}</h3>
//             <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {products.map((item) => (
//                     <div 
//                         key={item.productId} 
//                         className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
//                         onClick={() => handleProductClick(item.productId)}
//                         style={{ cursor: 'pointer' }}
//                     >
//                         <img 
//                             src={item.image_url} 
//                             alt={item.productdisplayname}
//                             className="product-image w-full h-48 object-cover rounded-md mb-2"
//                         />
//                         <h4 className="product-name font-medium text-gray-800">{item.productdisplayname}</h4>
//                         <p className="product-price text-gray-600">${item.price}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );

//     return (
//         <div className="home-container max-w-7xl mx-auto px-4">
//             <section className="hero-section py-12 text-center">
//                 <div className="hero-content max-w-3xl mx-auto">
//                     <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4">Upgrade Your Style!</h1>
//                     <p className="hero-subtitle text-xl md:text-2xl mb-6 text-gray-600">Discover the latest trends in fashion.</p>
//                     <a href="/shop" className="shop-button inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Shop Now</a>
//                 </div>
//             </section>

//             <section className="categories-section py-12">
//                 <h2 className="section-title text-3xl font-bold text-center mb-8">Shop by Category</h2>
//                 <div className="categories-grid space-y-12">
//                     <ProductList products={winterCollection} title="Winter Collection" />
//                     <ProductList products={summerCollection} title="Summer Collection" />
//                     <ProductList products={accessories} title="Accessories" />
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default Home;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

                const [winter, summer, access] = await Promise.all([
                    fetchCategory("winter", 4),
                    fetchCategory("summer", 4),
                    fetchCategory("accessories", 4),
                ]);

                setWinter(winter);
                setSummer(summer);
                setAccessory(access);

            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
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
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90">
                <div className="text-xl font-medium text-gray-700 flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 text-red-700">Error: {error}</div>;
    }

    const ProductList = ({ products, title }) => (
        <div className="category-section mb-16">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                <a href={`/shop/${title.toLowerCase().replace(" collection", "")}`} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    View All 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((item, index) => (
                    <div 
                        key={item.productId || `product-${index}`}
                        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => handleProductClick(item.productId)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="relative pb-[125%] overflow-hidden">
                            <img 
                                src={item.image_url} 
                                alt={item.productdisplayname}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h4 className="text-gray-900 font-medium line-clamp-2 h-12">{item.productdisplayname}</h4>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-lg font-bold text-blue-600">${item.price}</p>
                                <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Elevate Your Style</h1>
                        <p className="text-xl md:text-2xl opacity-90 mb-8">Discover curated collections for every season</p>
                        <div className="flex justify-center space-x-4">
                            <a href="/shop" className="inline-flex items-center bg-white text-blue-700 font-bold px-8 py-3 rounded-lg shadow-md hover:bg-blue-50 transition-colors">
                                Shop Now
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="/collections" className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition-colors">
                                View Collections
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="uppercase tracking-wider text-blue-600 font-medium">Categories</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Shop by Collection</h2>
                </div>
                
                <div className="space-y-16">
                    <ProductList products={winterCollection} title="Winter Collection" />
                    <ProductList products={summerCollection} title="Summer Collection" />
                    <ProductList products={accessories} title="Accessories" />
                </div>
            </section>
            
            <section className="bg-blue-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <span className="uppercase tracking-wider text-blue-600 font-medium">Limited Offer</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900">30% Off New Arrivals</h2>
                            <p className="text-gray-600 mb-6">Refresh your wardrobe with our latest styles at special introductory prices.</p>
                            <a href="/new-arrivals" className="inline-flex items-center bg-blue-600 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                Shop New Arrivals
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md"></div>
                                <div className="mt-2">
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md"></div>
                                <div className="mt-2">
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;