const { db } = require("../utilities/dbConnect")
const jwt = require('jsonwebtoken');

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

const checkIsAdmin=async(req,res)=>{
    const email=req.params.email;
    const result=await userCollection.findOne({email:email})
    if(result.role=='admin'){
       return res.send({isAdmin:true})
    }
    return res.send({isAdmin:false})
}

const jwtAuth = async (req, res) => {
    const email = req.params.email;
    const token = jwt.sign({email}, process.env.ACCESS_TOKEN_SECRETE, { expiresIn: '1h' });
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    }).send({ status: true })
}
module.exports = { addUsers,checkIsAdmin,jwtAuth }