const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            // ref: 'User'
        },
        orderId:{
            type:Number
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Pending'
        },
        paymentMethod: {
            type: String,
            enum: ['Credit Card', 'Debit Card', 'PayPal', 'UPI', 'Cash on Delivery'],
            required: true
        },
        orderStatus: {
            type: String,
            enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Processing'
        },
        shippingAddress: {
            fullName: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true }
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
