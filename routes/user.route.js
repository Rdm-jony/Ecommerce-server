const express = require('express');
const { addUsers, checkIsAdmin, jwtAuth } = require('../Controller/user.controller');
const router = express.Router()

router.put("/", addUsers)
router.get("/admin/:email", checkIsAdmin)
router.post('/jwt/:email',jwtAuth)

module.exports = router