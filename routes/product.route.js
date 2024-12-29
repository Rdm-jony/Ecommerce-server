const express = require('express');
const { addProducts, getTotalProduct, getProducts, getProductsById } = require('../Controller/product.controller');
const router = express.Router()

router.post('/', addProducts)
router.get('/total', getTotalProduct)
router.get('/', getProducts)
router.get('/:id', getProductsById)

module.exports = router