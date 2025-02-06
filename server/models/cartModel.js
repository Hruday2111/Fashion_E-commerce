const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productId: { type: String, required: true },  // Reference to product.id
    createdAt: { type: Date, default: Date.now }
});

const cart = mongoose.model('Cart', cartSchema);
module.exports = cart;
