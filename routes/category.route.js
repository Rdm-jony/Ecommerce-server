const express = require('express');
const { addCateory, getCategory, updateCategory, getCategoryById, deleteCategory, addSubCategory, getSubCategory, deleteSubCategory, getSubCategoryById } = require('../Controller/category.controller');
const router = express.Router()


router.route('/').post(addCateory).get(getCategory)
router.delete('/:id', deleteCategory)
router.route('/edit/:id').get(getCategoryById).patch(updateCategory)
router.route('/subCategory').get(getSubCategory).post(addSubCategory)
router.delete('/subCategory/:id', deleteSubCategory)
router.get('/subCategory/:categoryName', getSubCategoryById)

module.exports = router