const express = require('express');

const { createBkashPayment, paymentCallBack } = require('../Controller/payment.controller');
const { bkashAuth } = require('../api/Middileware/middilware');
const router=express.Router()

router.post('/bkash/payment/create',bkashAuth,createBkashPayment)
router.get('/bkash/payment/callback',bkashAuth,paymentCallBack)

module.exports=router









