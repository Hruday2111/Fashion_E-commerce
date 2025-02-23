const cartModel = require('../models/cartModel')
const product = require('../models/productModel')
const mongoose = require('mongoose')

// get all products 
const allproducts = async (req, res) => {
    try {
        // returns only product id and ignores default id
        const cartItems = await cartModel.find({}, { productId: 1, _id: 0 }).sort({ createdAt: -1 });
        // Extract product IDs from cartItems ex.["103", "102", "101"]
        const productIds = cartItems.map(item => item.productId);

        if (productIds.length === 0) {
            return res.status(200).json([]);
        }
        // Fetch products from the product collection based on IDs
        const products = await product.find({ id: { $in: productIds } });
        res.status(200).json(products);
    }
     catch (error) {
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};

// delete product
const deleteproduct = async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        const delPro = await cartModel.findOneAndDelete({ productId: id });
        if (!delPro) {
            return res.status(400).json({ error: 'No such product in cart' });
        }
        res.status(200).json({ message: 'Product removed from cart' });
    } 
    catch (error) {
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};

//post 
const addtocart = async (req, res) => {
    const { id } = req.query;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).json({ error: 'Invalid ID format' });
    //   }      
    if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }
    const newproduct = await product.findOne({ id: id });
    try {
        if(!newproduct){
            return res.status(400).json({ error: 'No such product available' });
        }
        else{
            await cartModel.create({ productId: id });
            res.status(200).json({ message: 'Product added to cart' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};

module.exports = {
    allproducts,
    deleteproduct,
    addtocart
} 
