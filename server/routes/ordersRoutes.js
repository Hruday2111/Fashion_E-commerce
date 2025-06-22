const express = require('express');
const router = express.Router();

const {
    createOrder,
    getAllOrdersByUserId
} = require('../controllers/orderController')

router.get('/',getAllOrdersByUserId)

router.post('/create',createOrder)

module.exports = router