const express = require('express');
const router = express.Router();

const {
    createOrder,
    getAllOrdersByUserId,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController')

const adminMiddleware = require('../middleware/adminMiddleware');

// User routes (require authentication)
router.get('/', getAllOrdersByUserId)
router.post('/create', createOrder)

// Admin routes (require admin authentication)
router.get('/admin', adminMiddleware, getAllOrders)
router.patch('/admin/:id', adminMiddleware, updateOrderStatus)

module.exports = router