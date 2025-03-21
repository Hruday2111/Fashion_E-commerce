import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
    const { id } = useParams(); //===================>>to change???
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/product/getProductById?query=${id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch product");
                }

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

    console.log(product);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <div>
            <h2>{product.productdisplayname}</h2>
            <img
                src={product.image_url}
                alt={product.productdisplayname}
                style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }}
            />
            <p>Price: ${product.price}</p>
        </div>
    );
};

export default ProductDetails;
