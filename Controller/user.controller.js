const { db } = require("../utilities/dbConnect")

const userCollection = db.collection('userCollection')
const addUsers = async (req, res) => {
    const user = req.body
    const email = user.email
    const options = { upsert: true }
    const doc = {
        $set: user
    }
    const result = await userCollection.updateOne({ email: email }, doc, options)
    res.send(result)
}

module.exports = { addUsers }