const { ObjectId } = require("mongodb");
const { db } = require("../utilities/dbConnect");
const productCollection = db.collection('productCollection')
const categoryCollection = db.collection('categoryCollection')
const reviewCollection = db.collection('reviewCollection')
const cartsCollection = db.collection('cartsCollection')
const orderCollection = db.collection('orderCollection')
const bannerCollection = db.collection('bannerCollection')
const userCollection = db.collection('userCollection')



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
    const totalOrder = await orderCollection.countDocuments({})
    const categories = await categoryCollection.find().toArray()
    const totalSubCategory = categories.reduce((total, category) => {
        return total + (category.subCategory ? category.subCategory.length : 0)
    }, 0)
    res.send({ toTalProduct, totalCategory, totalSubCategory, totalOrder })
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
    const result = await reviewCollection.insertOne(ratingInfo)
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
    const email = req.params.email;
    const result = await cartsCollection.find({ email: email }).toArray()
    const total = result.reduce((acc, cart) => {
        const cartTotal = cart.price * cart.count;
        return acc + cartTotal;
    }, 0);
    res.send({ result, totalAmount: total })
}
const updateCartCount = async (req, res) => {
    const id = req.body.id
    const count = req.body.count
    const doc = {
        $set: {
            count: count
        }
    }
    const result = await cartsCollection.updateOne({ _id: new ObjectId(id) }, doc)
    res.send(result)
}
const deleteProductCart = async (req, res) => {
    const id = req.params.id
    const result = await cartsCollection.deleteOne({ _id: new ObjectId(id) })
    res.send(result)
}

const getOrderProducts = async (req, res) => {
    const email = req.params.email;
    const user = await userCollection.findOne({ email: email })
    if (user?.role == 'admin') {
        if (email != req.user.email) {
            return res.status(403).send({ message: 'forbidden access!' })
        } else {
            const result = await orderCollection.find({}).toArray()
            return res.send(result)
        }
    } else {
        const result = await orderCollection.find({ "userInfo.email": email }).toArray()
        return res.send(result)
    }
    

}
const getReviws = async (req, res) => {
    const id = req.params.id;
    const result = await reviewCollection.find({ productId: id }).toArray()
    res.send(result)
}

const updatePaymentStatus = async (req, res) => {
    const updateInfo = req.body;
    const orderId = updateInfo.orderId;
    const query = { _id: new ObjectId(orderId) }
    const updateDoc = {
        $set: { status: updateInfo.status }
    }
    const result = await orderCollection.updateOne(query, updateDoc)
    res.send(result)
}

const addHomeBanner = async (req, res) => {
    const bannerData = req.body;
    console.log(bannerData)
    let result;
    if (bannerData?.bannerId) {
        result = await bannerCollection.updateOne({ _id: new ObjectId(bannerData?.bannerId) }, { $set: bannerData?.newBanner })
        return res.send(result)
    }
    result = await bannerCollection.insertOne(bannerData?.newBanner)
    res.send(result)
}
const getHomeBanner = async (req, res) => {
    const result = await bannerCollection.find().toArray()
    res.send(result)
}
const getHomeBannerById = async (req, res) => {
    const bannerId = req.params.id
    const result = await bannerCollection.findOne({ _id: new ObjectId(bannerId) })
    res.send(result)
}
const deleteHomeBanner = async (req, res) => {
    const bannerId = req.params.id;
    const result = await bannerCollection.deleteOne({ _id: new ObjectId(bannerId) })
    res.send(result)
}

const getFeaturedProducts = async (req, res) => {
    const result = await productCollection.find({ isFeatured: 'true' }).toArray()
    res.send(result)
}

const getRelatedProducts = async (req, res) => {
    const category = req.params.category
    const subCategory = req.query.subCategory
    const query = {
        productCategory: category,
    }
    if (!subCategory == 'undefined') {
        query.subCategory = subCategory
    }
    console.log(query)
    const result = await productCollection.find(query).toArray()
    res.send(result)
}

const getMaxPrice = async (req, res) => {
    const category = req.params.category;
    const result = await productCollection.aggregate([
        {
            $match: { productCategory: category }
        },
        {
            $group: {
                _id: null,
                maxPrice: { $max: "$price" }
            }
        }
    ]).toArray()
    res.send({ maxPrice: result[0]?.maxPrice || 0 })
}





module.exports = { addProducts, getTotalProduct, getProducts, getProductsById, deleteProduct, getPopularProducts, getListingProducts, addProductReview, addToCart, getAllCarts, deleteProductCart, updateCartCount, getOrderProducts, getReviws, updatePaymentStatus, addHomeBanner, getHomeBanner, getHomeBannerById, deleteHomeBanner, getFeaturedProducts, getRelatedProducts, getMaxPrice }