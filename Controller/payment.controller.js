const axios = require('axios');
const { json } = require('express');
const { getValue, setValue } = require("node-global-storage");
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns')
const { db } = require('../utilities/dbConnect');

const orderCollection = db.collection('orderCollection')
const cartsCollection = db.collection('cartsCollection')

const bkash_headers = async () => {
    return {
        "Content-Type": " application/json",
        Accept: "application/json",
        Authorization: getValue('id_token'),
        "X-App-Key": process.env.bkash_api_key
    }
}
const createBkashPayment = async (req, res) => {
    const paymentInfo = req.body;
    setValue('paymentInfo', JSON.stringify(paymentInfo))
    try {
        const { data } = await axios.post(process.env.bkash_create_payment_url, {
            mode: "0011",
            payerReference: " ",
            callbackURL: "http://localhost:5000/api/bkash/payment/callback",
            amount: paymentInfo?.productInfo.totalAmount,
            currency: "BDT",
            intent: "sale",
            merchantInvoiceNumber: 'Inv' + uuidv4().substring(0, 5)
        }, {
            headers: await bkash_headers()
        })
        if (data?.statusCode == '0000') {
            return res.send({ bkashURL: data.bkashURL })
        }

    } catch (error) {
        return res.statusCode(401).json({ message: error.message })
    }
}

const paymentCallBack = async (req, res) => {
    console.log(req.query)
    const { status, paymentID } = req.query
    if (status == 'cancel' || status == 'failure') {
        return res.redirect(`http://localhost:5173/payment/error/${status}`)
    }
    if (status == 'success') {
        const { data } = await axios.post(process.env.bkash_execute_payment_url, {
            paymentID: paymentID
        }, {
            headers: await bkash_headers()
        })
        if (data?.statusCode == '0000') {
            const getPaymentInfo = getValue('paymentInfo')
            if (getPaymentInfo) {
                const paymentInfo = JSON.parse(getPaymentInfo)
                paymentInfo.paymentID = data?.paymentID;
                paymentInfo.trxID = data?.trxID;
                paymentInfo.status = "pending";
                paymentInfo.date = format(new Date(), "dd-MM-yyyy");
                const result = await orderCollection.insertOne(paymentInfo)
                if (result?.insertedId) {
                    const result = await cartsCollection.deleteMany({ email: paymentInfo.userInfo.email })
                    if (result.deletedCount > 0) {
                        return res.redirect(`http://localhost:5173/payment/success?transactionId=${data?.trxID}&amount=${data?.amount}&status=${data?.transactionStatus}`)
                    }
                }
            }

        } else {
            return res.redirect(`http://localhost:5173/payment/error/${data?.statusMessage}`)
        }
        console.log(data)
    }
}

module.exports = { createBkashPayment, paymentCallBack }