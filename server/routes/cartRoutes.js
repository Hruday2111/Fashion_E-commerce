const express = require('express');
const router = express.Router();
const {
    allproducts,
    deleteproduct,
    addtocart
} = require('../controllers/cartController')

// get cart
router.get('/',allproducts)
// post to cart
router.post('/add',addtocart)
// del from cart
router.delete('/delete',deleteproduct)

module.exports = router