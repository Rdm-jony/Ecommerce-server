const { ObjectId } = require("mongodb");
const { db } = require("../utilities/dbConnect");
const productCollection = db.collection('productCollection')
const categoryCollection = db.collection('categoryCollection')



const addProducts = async (req, res) => {
    const newProducts = req.body;
    const result = await productCollection.insertOne(newProducts)
    res.send(result)
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

const getProducts=async(req,res)=>{
    const result=await productCollection.find({}).toArray()
    res.send(result)
}

const getProductsById=async(req,res)=>{
    const id=req.params.id;
    const result=await productCollection.findOne({_id:new ObjectId(id)})
    res.send(result)
}


module.exports = { addProducts, getTotalProduct,getProducts,getProductsById }