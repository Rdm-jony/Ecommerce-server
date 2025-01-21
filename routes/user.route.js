const express = require('express');
const { addUsers } = require('../Controller/user.controller');
const router = express.Router()

router.put("/", addUsers)

module.exports = router