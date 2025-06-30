const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

const createOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { paymentMethod, shippingAddress, items, totalAmount, subtotal, discount, deliveryCharges } = req.body;

        console.log('Creating order with data:', {
            userId,
            paymentMethod,
            itemsCount: items?.length,
            totalAmount,
            subtotal,
            discount,
            deliveryCharges
        });

        if (!userId || !paymentMethod || !shippingAddress || !items || items.length === 0) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create a new order
        const order = new Order({
            userId,
            items,
            totalAmount,
            subtotal,
            discount,
            deliveryCharges,
            paymentMethod,
            shippingAddress,
            paymentStatus: 'Pending',
            orderStatus: 'Processing'
        });

        console.log('Order object created:', order);

        // Save order to database
        const savedOrder = await order.save();
        console.log('Order saved successfully:', savedOrder._id);

        // Clear the user's cart after successful order creation
        try {
            await Cart.findOneAndUpdate(
                { userId },
                { productIds: [] },
                { new: true }
            );
            console.log('Cart cleared for user:', userId);
        } catch (cartError) {
            console.error('Error clearing cart:', cartError);
            // Don't fail the order if cart clearing fails
        }
        
        res.status(201).json({ 
            message: 'Order placed successfully', 
            order: savedOrder,
            orderId: savedOrder.orderId
        });
    } catch (error) {
        console.error('Order creation error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            details: error.stack
        });
    }
};

const getAllOrdersByUserId = async (req, res) => {
    try {
        const userId = req.userId;

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(200).json({ message: 'No previous orders placed', orders: [] });
        }

        res.status(200).json({ message: 'Orders fetched successfully', orders });
    } 
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all orders (for admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
};

// Update order status (for admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus: status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, error: 'Failed to update order status' });
    }
};

module.exports = { createOrder, getAllOrdersByUserId, getAllOrders, updateOrderStatus };
