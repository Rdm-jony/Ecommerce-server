const { db } = require('../utilities/dbConnect');
const { ObjectId } = require('mongodb');
const categoryCollection = db.collection('categoryCollection')
const addCateory = async (req, res) => {
    try {
        const newCateory = req.body;
        const findCategory = await categoryCollection.findOne({ categoryName: newCateory.categoryName })
        if (findCategory) {
            return res.json({ error: 'Already have this category!' })

        }
        const result = await categoryCollection.insertOne(newCateory)
        res.send(result)
    } catch (er) {
        console.log(er)
    }
}

const getCategory = async (req, res) => {
    const result = await categoryCollection.find({}).toArray()
    res.send(result)
}

const getCategoryById = async (req, res) => {
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const result = await categoryCollection.findOne(query)
    res.send(result)

}
const updateCategory = async (req, res) => {
    const category = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const doc = {
        $set: { ...category }
    }
    const result = await categoryCollection.updateOne(filter, doc)
    res.send(result)
}

const deleteCategory = async (req, res) => {
    const id = req.params.id;
    const result = await categoryCollection.deleteOne({ _id: new ObjectId(id) })
    res.send(result)
}

const addSubCategory = async (req, res) => {
    const newSubCategory = req.body;
    const findCategory = await categoryCollection.findOne({ categoryName: newSubCategory?.categoryName })
    const filter = { categoryName: findCategory?.categoryName }
    if (findCategory?.subCategory) {
        if (findCategory?.subCategory.includes(newSubCategory?.subCategoryName)) {
            return res.send({ error: `Sub-category '${newSubCategory?.subCategoryName}' is already exists to category '${newSubCategory?.categoryName}'`, })
        }
        const result = await categoryCollection.updateOne(filter, { $push: { subCategory: newSubCategory?.subCategoryName } })
        return res.send(result)
    } else {
        const result = await categoryCollection.updateOne(filter, { $set: { subCategory: [newSubCategory?.subCategoryName] } })
        return res.send(result)

    }

}

const getSubCategory = async (req, res) => {
    const result = await categoryCollection.find({ subCategory: { $exists: true, $ne: [] } }).toArray()
    res.send(result)
}

const deleteSubCategory = async (req, res) => {
    const id = req.params.id;
    const subCategoryName = req.query.sub;
    const result = await categoryCollection.updateOne({ _id: new ObjectId(id) }, { $pull: { subCategory: subCategoryName } })
    res.send(result)
}
const getSubCategoryById = async (req, res) => {
    const categoryName = req.params.categoryName;
    const result = await categoryCollection.findOne({ categoryName: categoryName })
    res.send(result?.subCategory ? result?.subCategory : [])
}
module.exports = { addCateory, getCategory, updateCategory, getCategoryById, deleteCategory, addSubCategory, getSubCategory, deleteSubCategory, getSubCategoryById }