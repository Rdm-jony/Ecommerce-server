const { ObjectId } = require("mongodb");
const { db } = require("../utilities/dbConnect");
const productCollection = db.collection('productCollection')
const categoryCollection = db.collection('categoryCollection')



const addProducts = async (req, res) => {
    const newProducts = req.body;
    const id = req.params.id;
    if (id == "undefined") {
        const result = await productCollection.insertOne(newProducts)
        return res.send(result)

    }

    const updateDoc = {
        $set: newProducts
    }
    const options = { upsert: true };

    const result = await productCollection.updateOne({ _id: new ObjectId(id) }, updateDoc, options)
    return res.send(result)
}




const getTotalProduct = async (req, res) => {
    const toTalProduct = await productCollection.countDocuments({})
    const totalCategory = await categoryCollection.countDocuments({})
    const categories = await categoryCollection.find().toArray()
    const totalSubCategory = categories.reduce((total, category) => {
        return total + (category.subCategory ? category.subCategory.length : 0)
    }, 0)
    res.send({ toTalProduct, totalCategory, totalSubCategory })
}

const getProducts = async (req, res) => {
    const category = req.query.cetegory
    console.log(category)
    if (category == "All") {
        const result = await productCollection.find({}).toArray()
        return res.send(result)
    }
    const result = await productCollection.find({ productCategory: category }).toArray()
    return res.send(result)
}

const getProductsById = async (req, res) => {
    const id = req.params.id;
    if (id == "undefined") {
        return;
    }
    const result = await productCollection.findOne({ _id: new ObjectId(id) })
    res.send(result)
}
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const result = await productCollection.deleteOne({ _id: new ObjectId(id) })
    res.send(result)
}

module.exports = { addProducts, getTotalProduct, getProducts, getProductsById, deleteProduct }