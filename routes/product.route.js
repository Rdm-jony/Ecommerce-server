const express = require('express');
const { addProducts, getTotalProduct, getProducts, getProductsById, deleteProduct } = require('../Controller/product.controller');
const router = express.Router()

router.put('/:id', addProducts)
router.get('/total', getTotalProduct)
router.get('/', getProducts)
router.get('/:id', getProductsById)
router.delete('/:id', deleteProduct)

module.exports = router