const { getValue, setValue, unsetValue } = require("node-global-storage");
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { db } = require("../../utilities/dbConnect");
const userCollection = db.collection('userCollection')

const bkashAuth = async (req, res, next) => {
    console.log("1st")
    unsetValue('id_token')
    try {
        const { data } = await axios.post(process.env.bkash_grant_token_url, {
            app_key: process.env.bkash_api_key,
            app_secret: process.env.bkash_secret_key
        }, {
            headers: {
                "Content-Type": " application/json",
                Accept: "application/json",
                username: process.env.bkash_username,
                password: process.env.bkash_password
            }
        })
        if (data?.statusCode == '0000') {
            setValue('id_token', data?.id_token, { protected: true })
            next()
        } else {
            return res.statusCode(401).json({ mesaage: statusMessage })
        }
    } catch (error) {
        return res.json({ message: error.message })
    }
}

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access!' })

    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access!' })
        }
        req.user = decoded;
        next()
    });

}

const verifyAdmin = async (req, res, next) => {
    try {
        const email = req.user.email
        const result = await userCollection.findOne({ email: email })
        if (result?.role == 'admin') {
            return next()
        }
        return res.status(403).send({ message: 'forbidden access!' })

    } catch (error) {

    }
}
module.exports = { bkashAuth, verifyToken, verifyAdmin }