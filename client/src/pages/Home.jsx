import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import API_BASE from '../config/api';

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
                        `${API_BASE}/api/product/filteredProducts?query=${category}&count=${count}`
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
            // Optionally show a toast or alert
            // alert('Item added to cart!');
            navigate('/cart');
        } catch (error) {
            alert('Please log in to add items to your cart.');
            navigate('/login');
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading amazing styles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-4">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-500 text-lg mb-4">Error: {error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const slides = [
        {
            title: 'Elevate Your Style',
            subtitle: 'Discover curated collections for every season',
            bgColor: 'from-purple-400 to-pink-400'
        },
        {
            title: 'Spring Collection',
            subtitle: 'Fresh looks blooming this season',
            bgColor: 'from-green-400 to-blue-400'
        },
        {
            title: 'Summer Essentials',
            subtitle: 'Stay cool and stylish in the heat',
            bgColor: 'from-yellow-400 to-orange-400'
        },
        {
            title: 'Autumn Trends',
            subtitle: 'Warm colors and bold patterns',
            bgColor: 'from-orange-400 to-red-400'
        },
        {
            title: 'Winter Wonders',
            subtitle: 'Cozy fits for the chilly vibes',
            bgColor: 'from-blue-400 to-indigo-400'
        },
    ];

    const quickCategories = [
        { name: "Men's Clothing", icon: "👔", query: "men" },
        { name: "Women's Dresses", icon: "👗", query: "dress" },
        { name: "Footwear", icon: "👟", query: "shoes" },
        { name: "Bags & Accessories", icon: "👜", query: "bag" },
        { name: "Kids Fashion", icon: "👶", query: "kids" },
        { name: "Sportswear", icon: "🏃‍♀️", query: "sports" }
    ];

    const brands = [
        "Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Levi's", "Gap", "Forever 21"
    ];

    const ProductList = ({ products, title, icon, showViewAll = true }) => (
        <div className="category-section mb-16">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white">
                        {icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                </div>
                {showViewAll && (
                    <a href={`/shop/${title.toLowerCase().replace(" collection", "").replace(" ", "-")}`} className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center group">
                        View All
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </a>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((item, index) => (
                    <div
                        key={item.productId || `product-${index}`}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer relative"
                    >
                        <div className="relative overflow-hidden" onClick={() => handleProductClick(item.productId)}>
                            <img
                                src={item.image_url}
                                alt={item.productdisplayname}
                                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        {/* Cart Icon Button */}
                        <button
                            className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-full p-2 shadow transition-colors"
                            title="Add to Cart"
                            onClick={(e) => { e.stopPropagation(); handleAddToCart(item.productId); }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </button>
                        <div className="p-4" onClick={() => handleProductClick(item.productId)}>
                            <h4 className="text-gray-900 font-medium line-clamp-2 h-12 mb-2">{item.productdisplayname}</h4>
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-bold text-indigo-600">₹{item.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        loop
                        className="max-w-4xl mx-auto text-center"
                    >
                        {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <div className={`bg-gradient-to-r ${slide.bgColor} text-white rounded-3xl p-12 shadow-2xl`}>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-xl md:text-2xl opacity-90 mb-8">
                                        {slide.subtitle}
                                    </p>
                                    <div className="flex justify-center space-x-4">
                                        <a
                                            href="/shop"
                                            className="inline-flex items-center bg-white text-gray-800 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        >
                                            Shop Now
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 ml-2"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </a>
                                        <a
                                            href="/collections"
                                            className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-gray-800 transition-all duration-300"
                                        >
                                            View Collections
                                        </a>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* Quick Categories */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="uppercase tracking-wider text-indigo-600 font-medium">Shop by Category</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Quick Access</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Find exactly what you're looking for with our curated categories</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {quickCategories.map((category, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(`/search?query=${category.query}`)}
                            className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                            <h3 className="font-semibold text-gray-800 text-sm">{category.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Shop by Occasion */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="uppercase tracking-wider text-indigo-600 font-medium">Occasions</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Dress for Every Moment</h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Find the perfect outfit for any occasion, from casual outings to special events</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div 
                            onClick={() => navigate('/search?query=party')}
                            className="group cursor-pointer"
                        >
                            <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-8 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <div className="text-5xl mb-4">🎉</div>
                                <h3 className="text-xl font-bold mb-2">Party & Events</h3>
                                <p className="text-purple-100 text-sm">Stunning outfits for celebrations</p>
                            </div>
                        </div>
                        <div 
                            onClick={() => navigate('/search?query=work')}
                            className="group cursor-pointer"
                        >
                            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl p-8 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <div className="text-5xl mb-4">💼</div>
                                <h3 className="text-xl font-bold mb-2">Work & Office</h3>
                                <p className="text-blue-100 text-sm">Professional attire for success</p>
                            </div>
                        </div>
                        <div 
                            onClick={() => navigate('/search?query=casual')}
                            className="group cursor-pointer"
                        >
                            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-8 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <div className="text-5xl mb-4">😊</div>
                                <h3 className="text-xl font-bold mb-2">Casual & Daily</h3>
                                <p className="text-green-100 text-sm">Comfortable everyday wear</p>
                            </div>
                        </div>
                        <div 
                            onClick={() => navigate('/search?query=wedding')}
                            className="group cursor-pointer"
                        >
                            <div className="bg-gradient-to-br from-rose-400 to-red-500 rounded-2xl p-8 text-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <div className="text-5xl mb-4">💒</div>
                                <h3 className="text-xl font-bold mb-2">Weddings & Formal</h3>
                                <p className="text-rose-100 text-sm">Elegant formal wear</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offer Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="uppercase tracking-wider text-indigo-200 font-medium">Limited Time Offer</span>
                                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Up to 50% Off New Arrivals</h2>
                                <p className="text-indigo-100 mb-6">Refresh your wardrobe with our latest styles at unbeatable prices.</p>
                                <a href="/new-arrivals" className="inline-flex items-center bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    Shop New Arrivals
                                </a>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                    <div className="aspect-square bg-white/30 rounded-lg"></div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                    <div className="aspect-square bg-white/30 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promotional Banners */}
            <section className="py-10">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
                    {/* Banner 1 */}
                    <div className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl overflow-hidden shadow-xl">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex-1">
                                <h2 className="text-2xl font-extrabold text-white">FLAT ₹300 OFF*</h2>
                                <p className="text-pink-100 mt-1">On All Products</p>
                                <div className="mt-3">
                                    <p className="text-sm text-pink-200 mb-1">USE CODE:</p>
                                    <div className="bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-lg inline-block">
                                        SHOPEASE300
                                    </div>
                                </div>
                            </div>
                            <div className="text-4xl">🎉</div>
                        </div>
                    </div>

                    {/* Banner 2 */}
                    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl overflow-hidden shadow-xl">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex-1">
                                <h2 className="text-2xl font-extrabold text-white">FLAT ₹200 OFF*</h2>
                                <p className="text-blue-100 mt-1">On All Products</p>
                                <div className="mt-3">
                                    <p className="text-sm text-blue-200 mb-1">USE CODE:</p>
                                    <div className="bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-lg inline-block">
                                        SHOPEASE200
                                    </div>
                                </div>
                            </div>
                            <div className="text-4xl">✨</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Showcase */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="uppercase tracking-wider text-indigo-600 font-medium">Our Brands</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Trusted by Top Brands</h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We partner with the world's leading fashion brands to bring you the best quality products</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
                        {brands.map((brand, index) => (
                            <div key={index} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="font-semibold text-gray-700 text-sm">{brand}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="uppercase tracking-wider text-indigo-600 font-medium">Categories</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Shop by Collection</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Discover our carefully curated collections designed for every style and occasion</p>
                </div>

                <div className="space-y-16">
                    <ProductList 
                        products={winterCollection} 
                        title="Winter Collection" 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    />
                    <ProductList 
                        products={summerCollection} 
                        title="Summer Collection" 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    />
                    <ProductList 
                        products={accessories} 
                        title="Accessories" 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
                    />
                </div>
            </section>

            {/* Footer */}
            <section className="bg-white border-t border-gray-200 px-6 py-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                    {/* Shop */}
                    <div>
                        <h2 className="font-semibold mb-3 text-gray-800">Shop</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Men</li>
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Women</li>
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Kids</li>
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Accessories</li>
                        </ul>
                    </div>

                    {/* Corporate Info */}
                    <div>
                        <h2 className="font-semibold mb-3 text-gray-800">Corporate Info</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">About SHOP EASE</li>
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Press</li>
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Investor Relations</li>
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Corporate Governance</li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h2 className="font-semibold mb-3 text-gray-800">Help</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Customer Service</li>
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Legal & Privacy</li>
                            <li className="hover:text-indigo-600 cursor-pointer transition-colors">Contact</li>
                        </ul>
                    </div>
                </div>

                {/* Socials & Legal */}
                <div className="mt-12 flex flex-col items-center gap-4 text-center text-xs text-gray-500">
                    <div className="flex gap-4 text-gray-400">
                        <svg className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                        <svg className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                        </svg>
                        <svg className="w-5 h-5 hover:text-indigo-600 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </div>
                    <p>&copy; 2024 SHOP EASE. All rights reserved.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;