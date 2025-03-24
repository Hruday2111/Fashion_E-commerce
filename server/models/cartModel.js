const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    productIds: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the 'updatedAt' field on each save
cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const cart = mongoose.model('Cart', cartSchema);
module.exports = cart;
