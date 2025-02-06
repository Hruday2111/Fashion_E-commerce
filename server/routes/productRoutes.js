const express = require('express');
const router = express.Router();
const {
    singleproduct,
    searchproducts
} = require('../controllers/productController')

// get the particular product for product page
router.get('/getProductById', singleproduct)

// get all searched query products
router.get('/search', searchproducts)

module.exports = router