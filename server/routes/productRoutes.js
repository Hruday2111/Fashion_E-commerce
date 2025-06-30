const express = require('express');
const router = express.Router();
const {
    singleproduct,
    searchproducts,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    feedback
} = require('../controllers/productController');
const adminMiddleware = require('../middleware/adminMiddleware');

// get the particular product for product page
router.get('/getProductById', singleproduct)

// get all searched query products
router.get('/search', searchproducts)

// get products for home and filtered products
router.get('/filteredProducts',searchproducts)

router.patch('/review',feedback)

// Admin routes - protected by admin middleware
router.get('/admin/products', adminMiddleware, getAllProducts);
router.post('/admin/products', adminMiddleware, addProduct);
router.put('/admin/products/:productId', adminMiddleware, updateProduct);
router.delete('/admin/products/:productId', adminMiddleware, deleteProduct);

module.exports = router