const { ObjectId } = require("mongodb");
const { db } = require("../utilities/dbConnect");
const productCollection = db.collection('productCollection')
const categoryCollection = db.collection('categoryCollection')
const reviewCollection = db.collection('reviewCollection')
const cartsCollection = db.collection('cartsCollection')



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
    const category = req.query.category
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
    const result = await productCollection.aggregate([
        {
            $match: { _id: new ObjectId(id) }
        },
        {
            $lookup: {
                from: "reviewCollection",
                localField: "_id",
                foreignField: 'productId',
                as: "productReviews"
            },

        },
        {
            $addFields: {
                avgRating: {
                    $avg: "$productReviews.rating"  // Calculate the average rating from all the reviews
                }
            }
        }

    ]).toArray()
    // const result = await productCollection.findOne({ _id: new ObjectId(id) })
    res.send(result[0])
}
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const result = await productCollection.deleteOne({ _id: new ObjectId(id) })
    res.send(result)
}

const getPopularProducts = async (req, res) => {
    const category = req.params.category;
    const result = await productCollection.find({ productCategory: category, isPopular: 'true' }).toArray()
    res.send(result)
}

const getListingProducts = async (req, res) => {
    const category = req.query.category;
    const subCategory = req.query.subCategory;
    const priceRange = req.query.priceRange.split(",")
    const rating = req.query.rating;
    const intRating = rating ? parseInt(rating) : ''
    const minPrice = parseInt(priceRange[0])
    const maxPrice = parseInt(priceRange[1])
    const result = await productCollection.aggregate([
        {
            $addFields: {
                price: { $toInt: "$price" },
            }
        },
        {
            $match: {
                price: {
                    $gte: minPrice,  // Filter by minimum price
                    $lte: maxPrice   // Filter by maximum price
                },
                ...(category ? { productCategory: category } : {}),
                ...(subCategory ? { subCategory: subCategory } : {}),
                ...(intRating ? { rating: intRating } : {}),
            },

        },
    ]).toArray()
    res.send(result)
}

const addProductReview = async (req, res) => {
    const ratingInfo = req.body
    ratingInfo.productId = new ObjectId(ratingInfo.productId)
    const options = { upsert: true }
    const doc = {
        $set: ratingInfo
    }
    const query = { email: ratingInfo.email }
    const result = await reviewCollection.updateOne(query, doc, options)
    res.send(result)
}

const addToCart = async (req, res) => {

    const cartInfo = req.body
    cartInfo.productId = new ObjectId(cartInfo.productId)
    const query = {
        email: cartInfo.email,
        productId: cartInfo.productId
    }
    const exists = await cartsCollection.findOne(query)
    if (exists) {
        return res.send({ message: 'Already exists!' })
    }
    const result = await cartsCollection.insertOne(cartInfo)

    res.send(result)
}

const getAllCarts = async (req, res) => {
    const result = await cartsCollection.find().toArray()
    const total = result.reduce((acc, cart) => {
        const cartTotal = cart.price * cart.count;
        return acc + cartTotal;
    }, 0);
    res.send({result,totalAmount:total})
}
const updateCartCount=async(req,res)=>{
    const id=req.body.id
    const count=req.body.count
    const doc={
        $set:{
            count:count
        }
    }
    const result=await cartsCollection.updateOne({_id:new ObjectId(id)},doc)
    res.send(result)
}
const deleteProductCart=async(req,res)=>{
    const id=req.params.id
    const result= await cartsCollection.deleteOne({_id:new ObjectId(id)})
    res.send(result)
}

module.exports = { addProducts, getTotalProduct, getProducts, getProductsById, deleteProduct, getPopularProducts, getListingProducts, addProductReview, addToCart,getAllCarts,deleteProductCart,updateCartCount }