const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    size: {
        type: String,
        default: 'Standard'
    },
    image_url: {
        type: String
    }
});

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        orderId: {
            type: String,
            unique: true
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        deliveryCharges: {
            type: Number,
            default: 0
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

// Generate order ID before saving
orderSchema.pre('save', function(next) {
    if (!this.orderId) {
        this.orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
