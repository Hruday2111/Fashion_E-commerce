const cartModel = require('../models/cartModel')
const product = require('../models/productModel')
const mongoose = require('mongoose');
const { findOne } = require('../models/profileModel');

// To get all products for a userId
const allproducts = async (req, res) => {
    try {
        const userId = req.userId 
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        const cart = await cartModel.findOne({ userId });
        if (!cart || !cart.productIds || cart.productIds.length === 0) {
            return res.status(200).json({ message: "Your cart is empty" });
        }
        
        const productIds = cart.productIds;

        const products = await product.find({ productId: { $in: productIds } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};

// delete product from cart for a user
const deleteproduct = async (req, res) => {

    const userId = req.userId
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { productId } = req.query
    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        let cart = await cartModel.findOne({userId})
        cart.productIds.pull(productId)
        await cart.save()
        res.status(200).json({ message: 'Product deleted from cart' });
    } 
    catch (error) {
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};

// To add a product into a usre's cart  
const addtocart = async (req, res) => {
    const userId = req.userId
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    console.log("User ID:", userId);

    if (!userId) {
        return res.status(400).json({ error: 'User not authenticated' });
    }

    const { productId } = req.query;
    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        // Verify the product exists
        const foundProduct = await product.findOne({ productId: productId });
        if (!foundProduct) {
            return res.status(400).json({ error: 'No such product available' });
        }

        // Use let instead of const so we can reassign if needed
        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = await cartModel.create({
                userId: userId,
                productIds: [productId]
            });
        } else {
            if (!cart.productIds.includes(productId)) {
                cart.productIds.push(productId);
                await cart.save();
                res.status(200).json({ message: 'Product added to cart' });
            }
            else res.status(200).json({ message: 'Already present in cart' });
        }

    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};

module.exports = {
    allproducts,
    deleteproduct,
    addtocart
} 
