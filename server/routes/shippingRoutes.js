const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Apply admin middleware to all shipping routes
router.use(adminMiddleware);

// ==================== SHIPPING METHODS ROUTES ====================
router.get('/methods', shippingController.getAllShippingMethods);
router.post('/methods', shippingController.createShippingMethod);
router.put('/methods/:id', shippingController.updateShippingMethod);
router.delete('/methods/:id', shippingController.deleteShippingMethod);

// ==================== SHIPPING RATES ROUTES ====================
router.get('/rates', shippingController.getAllShippingRates);
router.post('/rates', shippingController.createShippingRate);
router.put('/rates/:id', shippingController.updateShippingRate);
router.delete('/rates/:id', shippingController.deleteShippingRate);

// ==================== ORDER SHIPPING ROUTES ====================
router.get('/orders', shippingController.getAllOrderShipping);
router.get('/orders/:orderId', shippingController.getOrderShipping);
router.put('/orders/:orderId', shippingController.updateOrderShipping);
router.patch('/orders/:orderId/status', shippingController.updateShippingStatus);

// ==================== SHIPPING STATISTICS ====================
router.get('/stats', shippingController.getShippingStats);

module.exports = router; 