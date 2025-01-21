const express = require('express');
const { addProducts, getTotalProduct, getProducts, getProductsById, deleteProduct, getPopularProducts, getListingProducts, addProductReview, addToCart, getAllCarts, deleteProductCart, updateCartCount } = require('../Controller/product.controller');
const router = express.Router()

router.put('/:id', addProducts)
router.put('/review/add', addProductReview)
router.post('/carts/add', addToCart)
router.get('/carts', getAllCarts)
router.get('/total', getTotalProduct)
router.get('/', getProducts)
router.get('/product/:id', getProductsById)
router.delete('/:id', deleteProduct)
router.get('/popular/:category', getPopularProducts)
router.get('/listing', getListingProducts)
router.delete('/carts/:id', deleteProductCart)
router.patch('/carts', updateCartCount)

module.exports = router