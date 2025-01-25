const express = require('express');
const { addProducts, getTotalProduct, getProducts, getProductsById, deleteProduct, getPopularProducts, getListingProducts, addProductReview, addToCart, getAllCarts, deleteProductCart, updateCartCount, getOrderProducts, getReviws, updatePaymentStatus, addHomeBanner, getHomeBanner, getHomeBannerById, deleteHomeBanner, getFeaturedProducts, getRelatedProducts, getMaxPrice } = require('../Controller/product.controller');
const { verifyToken } = require('../api/Middileware/middilware');
const router = express.Router()

router.put('/:id', addProducts)
router.post('/review/add', addProductReview)
router.post('/carts/add', addToCart)
router.get('/carts/:email', getAllCarts)
router.get('/total', getTotalProduct)
router.get('/', getProducts)
router.get('/product/:id', getProductsById)
router.delete('/:id', deleteProduct)
router.get('/popular/:category', getPopularProducts)
router.get('/feature', getFeaturedProducts)
router.get('/related/:category', getRelatedProducts)
router.get('/listing', getListingProducts)
router.delete('/carts/:id', deleteProductCart)
router.patch('/carts', updateCartCount)
router.get('/order/:email',verifyToken,getOrderProducts)
router.get('/review/:id',getReviws)
router.patch('/order',updatePaymentStatus)
router.put('/banner/add',addHomeBanner)
router.get('/banner',getHomeBanner)
router.delete('/banner/:id',deleteHomeBanner)
router.get('/banner/:id',getHomeBannerById)
router.get('/price/max/:category',getMaxPrice)


module.exports = router