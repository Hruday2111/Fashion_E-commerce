// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { useAuth } from "../context/AuthContext";

// const ProductDetails = () => {
//     const { isLoggedIn } = useAuth();
//     const { id } = useParams();
//     console.log(" verify in id detail",id)
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const response = await fetch(`http://localhost:4000/api/product/getProductById?query=${id}`);
//                 if (!response.ok) throw new Error("Failed to fetch product");

//                 const data = await response.json();
//                 setProduct(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProduct();
//     }, [id]);

//     const handleCartClickWrapper = () => {
//         if (isLoggedIn) {
//             handleCartClick();
//         } else {
//             alert('Please log in to add items to your cart.');
//             navigate('/login');
//         }
//     };
//     const handleBuyNowClickWrapper = () => {
//         if (isLoggedIn) {
//             handleBuyNowClick();
//         } else {
//             alert('Please log in to proceed further.');
//             navigate('/login');
//         }
//     };

//     const handleCartClick = async () => {
//         try {
//             // Send POST request to add item to cart
//             const response = await fetch(`http://localhost:4000/api/cart/add/?productId=${id}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include' // Important for sending cookies/auth tokens
//             });
//             console.log(response);
//             if (!response.ok) {
//                 throw new Error('Failed to add item to cart');
//             }

//             // Optional: Show success message
//             alert('Item added to cart successfully!');

//             // Navigate to cart page
//             navigate('/cart');
//         } catch (error) {
//             console.error('Error adding item to cart:', error);
//             // alert('Failed to add item to cart. Please try again.');
//         }
//     };

//     const handleBuyNowClick = async () => {
//         navigate(`/checkout/${id}`);
//     }

//     if (loading) return <p className="text-center text-gray-500 text-lg">Loading...</p>;
//     if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>;

//     return (
//         <div className="max-w-5xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-6">
//             {/* Image + Product Info (Side by Side) */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Left - Product Image */}
//                 <div>
//                     <img
//                         src={product.image_url}
//                         alt={product.productdisplayname}
//                         className="w-full h-auto rounded-lg shadow-md"
//                     />
//                 </div>

//                 {/* Right - Product Info */}
//                 <div className="flex flex-col justify-center">
//                     <h2 className="text-3xl font-bold text-gray-800">{product.productdisplayname}</h2>
//                     <p className="text-xl font-semibold text-green-600 mt-2">Price: ₹{product.price}</p>

//                     {/* Buttons */}
//                     <div className="flex gap-4 mt-4">
//                         <button
//                             className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
//                             onClick={() => handleCartClickWrapper()}
//                             style={{ cursor: 'pointer' }}>
//                             Add to Cart
//                         </button>
//                         <button
//                             className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
//                             onClick={() => handleBuyNowClickWrapper()}
//                             style={{ cursor: 'pointer' }}>
//                             Buy Now
//                         </button>
//                     </div>

//                     {/* Sizes & Offers Section */}
//                     <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
//                         <h3 className="text-lg font-semibold">Sizes:</h3>
//                         <div className="flex gap-2 mt-2">
//                             {["S", "M", "L", "XL"].map((size) => (
//                                 <span key={size} className="border px-3 py-1 rounded-md shadow-sm cursor-pointer hover:bg-gray-100">{size}</span>
//                             ))}
//                         </div>

//                         <h3 className="text-lg font-semibold mt-4">Offers:</h3>
//                         <p className="text-sm text-gray-700">Flat 10% off on first order!</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Product Details Section */}
//             <div className="mt-6 p-6 rounded-lg shadow-md bg-white">
//                 <h3 className="text-2xl font-bold">Product Details</h3>
//                 <p className="text-gray-700"><b>Category:</b> {product.mastercategory} - {product.subcategory}</p>
//                 <p className="text-gray-700"><b>Type:</b> {product.articletype}</p>
//                 <p className="text-gray-700"><b>Color:</b> {product.basecolour}</p>
//                 <p className="text-gray-700"><b>Gender:</b> {product.gender}</p>
//                 <p className="text-gray-700"><b>Usage:</b> {product.usage}</p>
//                 <p className="text-gray-700"><b>Season:</b> {product.season}</p>
//             </div>

//             {/* Delivery Section */}
//             <div className="mt-6 p-6 rounded-lg shadow-md bg-white">
//                 <h3 className="text-2xl font-bold">Delivery Information</h3>
//                 <p className="text-gray-700">Estimated Delivery: 3-5 Business Days</p>
//                 <p className="text-gray-700">Free Shipping on orders above ₹1000</p>
//             </div>

//             {/* Related Products Section */}
//             <div className="mt-6 p-6 rounded-lg shadow-md bg-white">
//                 <h3 className="text-2xl font-bold">Related Products</h3>
//                 <p className="text-gray-700">Check out similar items that you might like.</p>
//             </div>
//         </div>
//     );
// };

// export default ProductDetails;

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

    if (loading) return <p className="text-center text-gray-500 text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500 text-lg">Error: {error}</p>;

    //     return (
    //         <div className="max-w-5xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-6">
    //             {/* Rest of your component remains the same */}
    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //                 <div>
    //                     <img
    //                         src={product.image_url}
    //                         alt={product.productdisplayname}
    //                         className="w-full h-auto rounded-lg shadow-md"
    //                     />
    //                 </div>

    //                 <div className="flex flex-col justify-center">
    //                     <h2 className="text-3xl font-bold text-gray-800">{product.productdisplayname}</h2>
    //                     <p className="text-xl font-semibold text-green-600 mt-2">Price: ₹{product.price}</p>

    //                     <div className="flex gap-4 mt-4">
    //                         <button
    //                             className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
    //                             onClick={handleCartClickWrapper}
    //                             style={{ cursor: 'pointer' }}>
    //                             Add to Cart
    //                         </button>
    //                         <button
    //                             className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
    //                             onClick={handleBuyNowClickWrapper}
    //                             style={{ cursor: 'pointer' }}>
    //                             Buy Now
    //                         </button>
    //                     </div>

    //                     <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
    //                         <h3 className="text-lg font-semibold">Sizes:</h3>
    //                         <div className="flex gap-2 mt-2">
    //                             {["S", "M", "L", "XL"].map((size) => (
    //                                 <span key={size} className="border px-3 py-1 rounded-md shadow-sm cursor-pointer hover:bg-gray-100">{size}</span>
    //                             ))}
    //                         </div>

    //                         <h3 className="text-lg font-semibold mt-4">Offers:</h3>
    //                         <p className="text-sm text-gray-700">Flat 10% off on first order!</p>
    //                     </div>
    //                 </div>
    //             </div>

    //             <div className="mt-6 p-6 rounded-lg shadow-md bg-white">
    //                 <h3 className="text-2xl font-bold">Product Details</h3>
    //                 <p className="text-gray-700"><b>Category:</b> {product.mastercategory} - {product.subcategory}</p>
    //                 <p className="text-gray-700"><b>Type:</b> {product.articletype}</p>
    //                 <p className="text-gray-700"><b>Color:</b> {product.basecolour}</p>
    //                 <p className="text-gray-700"><b>Gender:</b> {product.gender}</p>
    //                 <p className="text-gray-700"><b>Usage:</b> {product.usage}</p>
    //                 <p className="text-gray-700"><b>Season:</b> {product.season}</p>
    //             </div>

    //             <div className="mt-6 p-6 rounded-lg shadow-md bg-white">
    //                 <h3 className="text-2xl font-bold">Delivery Information</h3>
    //                 <p className="text-gray-700">Estimated Delivery: 3-5 Business Days</p>
    //                 <p className="text-gray-700">Free Shipping on orders above ₹1000</p>
    //             </div>

    //             <div className="mt-6 p-6 rounded-lg shadow-md bg-white">
    //                 <h3 className="text-2xl font-bold">Related Products</h3>
    //                 <p className="text-gray-700 mb-4">Check out similar items that you might like.</p>
    //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" >

    //                     {similar.map((product, index) => (
    //                         <div
    //                             key={index}
    //                             className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
    //                             onClick={() => handleProductClick(product.productId)} 
    //                             style={{ cursor: 'pointer' }}
    //                         >
    //                             <img
    //                                 src={product.image_url}
    //                                 alt={product.productdisplayname}
    //                                 className="w-full h-40 object-cover rounded-md mb-2"
    //                             />
    //                             <h4 className="text-lg font-semibold">{product.productdisplayname}</h4>
    //                             <p className="text-gray-600">${product.price}</p>
    //                         </div>
    //                     ))}
    //                 </div>
    //             </div>

    //         </div>
    //     );
    // };

    // export default ProductDetails;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Product Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-md">
                <img
                    src={product.image_url}
                    alt={product.productdisplayname}
                    className="w-full h-[400px] object-cover rounded-lg shadow"
                />
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">{product.productdisplayname}</h2>
                        <p className="text-2xl font-semibold text-green-600 mb-4">₹{product.price}</p>
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-2">Sizes</h3>
                            <div className="flex gap-3">
                                {["S", "M", "L", "XL"].map((size) => (
                                    <span key={size} className="border px-4 py-1 rounded-full text-sm shadow cursor-pointer hover:bg-gray-100">
                                        {size}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-1">Offers</h3>
                            <p className="text-sm text-gray-700">🎉 Flat 10% off on first order!</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button
                            onClick={handleCartClickWrapper}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition shadow-md"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNowClickWrapper}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition shadow-md"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Product Details</h3>
                <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
                    <li><b>Category:</b> {product.mastercategory} - {product.subcategory}</li>
                    <li><b>Type:</b> {product.articletype}</li>
                    <li><b>Color:</b> {product.basecolour}</li>
                    <li><b>Gender:</b> {product.gender}</li>
                    <li><b>Usage:</b> {product.usage}</li>
                    <li><b>Season:</b> {product.season}</li>
                </ul>
            </div>

            {/* Delivery Info */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Delivery Information</h3>
                <p className="text-gray-700">📦 Estimated Delivery: 3-5 Business Days</p>
                <p className="text-gray-700">🚚 Free Shipping on orders above ₹1000</p>
            </div>

            {/* Related Products */}
            <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Related Products</h3>
                <p className="text-gray-600 mb-4">Check out similar items that you might like.</p>

                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-6 w-max transition-all duration-300 ease-in-out">
                        {similar.map((product, index) => (
                            <div
                                key={index}
                                onClick={() => handleProductClick(product.productId)}
                                className="min-w-[200px] max-w-[200px] cursor-pointer rounded-lg p-4 shadow-sm hover:shadow-md transition group"
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
    );
}
export default ProductDetails;